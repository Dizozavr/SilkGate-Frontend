const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { auth, isAdmin } = require('../middleware/authMiddleware');
const { checkAdminAccess } = require('../middleware/conversationAccessMiddleware');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { createMessageHash } = require('../utils/encryption');

// Все маршруты требуют аутентификации и прав администратора
router.use(auth);
router.use(isAdmin);

// Получить все диалоги, где приглашен администратор
router.get('/conversations', async (req, res) => {
  try {
    const { userId } = req.user;
    
    const conversations = await Conversation.find({
      admin_invited: true,
      'participants.user_id': userId,
      is_active: true
    })
    .populate('participants.user_id', 'name email')
    .sort({ 'last_message.timestamp': -1, updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching admin conversations:', error);
    res.status(500).json({ message: 'Ошибка при получении диалогов' });
  }
});

// Получить сообщения диалога (только для приглашенных диалогов)
router.get('/conversations/:conversationId/messages', checkAdminAccess, chatController.getMessages);

// Отправить сообщение от имени администратора
router.post('/messages', async (req, res) => {
  try {
    const { userId } = req.user;
    const { conversation_id, content, message_type = 'text' } = req.body;

    // Проверяем, что администратор приглашен в диалог
    const conversation = await Conversation.findOne({
      _id: conversation_id,
      admin_invited: true,
      'participants.user_id': userId,
      is_active: true
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Диалог не найден или администратор не приглашен' });
    }

    // Создаем сообщение от имени администратора
    const timestamp = new Date();
    const messageHash = createMessageHash(content, timestamp, userId);
    const encryptedContent = Buffer.from(content).toString('base64');
    const signature = Buffer.from(`${content}${timestamp}${userId}`).toString('base64');

    const message = new Message({
      conversation_id,
      sender: {
        user_id: userId,
        user_model: 'User',
        username: 'Администратор'
      },
      encrypted_content: encryptedContent,
      signature: signature,
      message_hash: messageHash,
      message_type
    });

    await message.save();

    // Обновляем последнее сообщение в диалоге
    conversation.last_message = {
      encrypted_content: encryptedContent,
      sender_id: userId,
      sender_model: 'User',
      timestamp: timestamp
    };

    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending admin message:', error);
    res.status(500).json({ message: 'Ошибка при отправке сообщения' });
  }
});

// Получить статистику диалогов
router.get('/statistics', async (req, res) => {
  try {
    const totalConversations = await Conversation.countDocuments({ admin_invited: true });
    const activeConversations = await Conversation.countDocuments({ 
      admin_invited: true, 
      is_active: true 
    });
    
    const todayConversations = await Conversation.countDocuments({
      admin_invited: true,
      'admin_invited_by.timestamp': {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.json({
      total_conversations: totalConversations,
      active_conversations: activeConversations,
      today_invitations: todayConversations
    });
  } catch (error) {
    console.error('Error getting admin statistics:', error);
    res.status(500).json({ message: 'Ошибка при получении статистики' });
  }
});

module.exports = router; 