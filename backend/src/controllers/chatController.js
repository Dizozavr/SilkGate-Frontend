const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Investor = require('../models/Investor');
const User = require('../models/User');

// Получить все диалоги пользователя
const getConversations = async (req, res) => {
  try {
    const { userId, userModel } = req.user;
    
    const conversations = await Conversation.find({
      'participants.user_id': userId,
      is_active: true
    })
    .populate('participants.user_id', 'name email')
    .sort({ 'last_message.timestamp': -1, updatedAt: -1 });

    // Добавляем информацию о собеседнике и непрочитанных сообщениях
    const conversationsWithDetails = conversations.map(conv => {
      const otherParticipant = conv.getOtherParticipant(userId);
      const unreadCount = conv.unread_count.get(userId.toString()) || 0;
      
      return {
        _id: conv._id,
        other_participant: otherParticipant,
        last_message: conv.last_message,
        unread_count: unreadCount,
        updated_at: conv.updatedAt
      };
    });

    res.json(conversationsWithDetails);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Ошибка при получении диалогов' });
  }
};

// Создать новый диалог или найти существующий
const createOrGetConversation = async (req, res) => {
  try {
    const { userId, userModel } = req.user;
    const { other_user_id, other_user_model } = req.body;

    // Проверяем права доступа
    if (userModel === 'Startup' || userModel === 'User') {
      return res.status(403).json({ 
        message: 'Только инвесторы и администраторы могут инициировать диалоги' 
      });
    }

    // Проверяем существование собеседника
    let otherUser;
    if (other_user_model === 'Investor') {
      otherUser = await Investor.findById(other_user_id);
    } else {
      otherUser = await User.findById(other_user_id);
    }

    if (!otherUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Ищем существующий диалог
    let conversation = await Conversation.findOne({
      'participants.user_id': { $all: [userId, other_user_id] },
      'participants': { $size: 2 },
      is_active: true
    });

    if (!conversation) {
      // Получаем информацию о текущем пользователе
      let currentUser;
      if (userModel === 'Investor') {
        currentUser = await Investor.findById(userId);
      } else {
        currentUser = await User.findById(userId);
      }

      // Создаем новый диалог
      conversation = new Conversation({
        participants: [
          {
            user_id: userId,
            user_model: userModel,
            username: currentUser.name || currentUser.email
          },
          {
            user_id: other_user_id,
            user_model: other_user_model,
            username: otherUser.name || otherUser.email
          }
        ]
      });
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Ошибка при создании диалога' });
  }
};

// Получить сообщения диалога
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.user;
    const { page = 1, limit = 50 } = req.query;

    // Проверяем, что пользователь является участником диалога
    const conversation = await Conversation.findOne({
      _id: conversationId,
      'participants.user_id': userId,
      is_active: true
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Диалог не найден' });
    }

    // Получаем сообщения
    const messages = await Message.find({
      conversation_id: conversationId,
      is_deleted: false
    })
    .sort({ created_at: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('sender.user_id', 'name email');

    // Помечаем сообщения как прочитанные
    await Message.updateMany(
      {
        conversation_id: conversationId,
        'sender.user_id': { $ne: userId },
        is_read: false,
        is_deleted: false
      },
      { is_read: true, read_at: new Date() }
    );

    // Сбрасываем счетчик непрочитанных
    await conversation.resetUnreadCount(userId);

    res.json({
      messages: messages.reverse(),
      has_more: messages.length === limit
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Ошибка при получении сообщений' });
  }
};

// Отправить сообщение
const sendMessage = async (req, res) => {
  try {
    const { userId, userModel } = req.user;
    const { conversation_id, content, message_type = 'text', attachments = [] } = req.body;

    // Проверяем существование диалога
    const conversation = await Conversation.findOne({
      _id: conversation_id,
      'participants.user_id': userId,
      is_active: true
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Диалог не найден' });
    }

    // Получаем информацию о пользователе
    let currentUser;
    if (userModel === 'Investor') {
      currentUser = await Investor.findById(userId);
    } else {
      currentUser = await User.findById(userId);
    }

    // Создаем сообщение
    const message = new Message({
      conversation_id,
      sender: {
        user_id: userId,
        user_model: userModel,
        username: currentUser.name || currentUser.email
      },
      content,
      message_type,
      attachments
    });

    await message.save();

    // Обновляем последнее сообщение в диалоге
    conversation.last_message = {
      content,
      sender_id: userId,
      sender_model: userModel,
      timestamp: new Date()
    };

    // Увеличиваем счетчик непрочитанных для собеседника
    const otherParticipant = conversation.getOtherParticipant(userId);
    if (otherParticipant) {
      await conversation.incrementUnreadCount(otherParticipant.user_id);
    }

    await conversation.save();

    // Возвращаем созданное сообщение
    const populatedMessage = await Message.findById(message._id)
      .populate('sender.user_id', 'name email');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Ошибка при отправке сообщения' });
  }
};

// Пометить сообщения как прочитанные
const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.user;

    // Проверяем, что пользователь является участником диалога
    const conversation = await Conversation.findOne({
      _id: conversationId,
      'participants.user_id': userId,
      is_active: true
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Диалог не найден' });
    }

    // Помечаем сообщения как прочитанные
    await Message.updateMany(
      {
        conversation_id: conversationId,
        'sender.user_id': { $ne: userId },
        is_read: false,
        is_deleted: false
      },
      { is_read: true, read_at: new Date() }
    );

    // Сбрасываем счетчик непрочитанных
    await conversation.resetUnreadCount(userId);

    res.json({ message: 'Сообщения помечены как прочитанные' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Ошибка при пометке сообщений' });
  }
};

// Удалить сообщение
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.user;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Сообщение не найдено' });
    }

    // Проверяем, что пользователь является отправителем
    if (message.sender.user_id.toString() !== userId) {
      return res.status(403).json({ message: 'Нет прав для удаления этого сообщения' });
    }

    // Мягкое удаление
    await message.softDelete();

    res.json({ message: 'Сообщение удалено' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Ошибка при удалении сообщения' });
  }
};

// Получить количество непрочитанных сообщений
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.user;

    const conversations = await Conversation.find({
      'participants.user_id': userId,
      is_active: true
    });

    let totalUnread = 0;
    for (const conv of conversations) {
      const unreadCount = conv.unread_count.get(userId.toString()) || 0;
      totalUnread += unreadCount;
    }

    res.json({ unread_count: totalUnread });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Ошибка при получении количества непрочитанных' });
  }
};

// Специальный endpoint для чат-бота - создание чата с админом
const createChatWithAdmin = async (req, res) => {
  try {
    const { userId, userModel } = req.user;
    const { initial_message } = req.body;

    // Находим админа в системе
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      return res.status(404).json({ message: 'Администратор не найден' });
    }

    // Получаем информацию о текущем пользователе
    let currentUser;
    if (userModel === 'Investor') {
      currentUser = await Investor.findById(userId);
    } else {
      currentUser = await User.findById(userId);
    }

    if (!currentUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Ищем существующий диалог с админом
    let conversation = await Conversation.findOne({
      'participants.user_id': { $all: [userId, admin._id] },
      'participants': { $size: 2 },
      is_active: true
    });

    if (!conversation) {
      // Создаем новый диалог с админом
      conversation = new Conversation({
        participants: [
          {
            user_id: userId,
            user_model: userModel,
            username: currentUser.name || currentUser.email
          },
          {
            user_id: admin._id,
            user_model: 'User',
            username: 'Администратор'
          }
        ]
      });
      await conversation.save();
    }

    // Если есть начальное сообщение, добавляем его
    if (initial_message) {
      const message = new Message({
        conversation_id: conversation._id,
        sender_id: userId,
        sender_model: userModel,
        content: initial_message,
        message_type: 'text'
      });
      await message.save();

      // Обновляем последнее сообщение в диалоге
      conversation.last_message = {
        content: initial_message,
        sender_id: userId,
        timestamp: new Date()
      };
      await conversation.save();
    }

    res.json({
      conversation_id: conversation._id,
      message: 'Чат с администратором создан успешно'
    });
  } catch (error) {
    console.error('Error creating chat with admin:', error);
    res.status(500).json({ message: 'Ошибка при создании чата с администратором' });
  }
};

module.exports = {
  getConversations,
  createOrGetConversation,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  getUnreadCount,
  createChatWithAdmin
}; 