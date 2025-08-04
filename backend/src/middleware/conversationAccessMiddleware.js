const Conversation = require('../models/Conversation');

// Проверка доступа к диалогу
const checkConversationAccess = async (req, res, next) => {
  try {
    const { userId, userModel } = req.user;
    const { conversationId } = req.params;

    // Проверяем существование диалога
    const conversation = await Conversation.findOne({
      _id: conversationId,
      is_active: true
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Диалог не найден' });
    }

    // Проверяем, является ли пользователь участником диалога
    const isParticipant = conversation.participants.some(p => 
      p.user_id.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'У вас нет доступа к этому диалогу' });
    }

    // Добавляем диалог в request для использования в контроллерах
    req.conversation = conversation;
    next();
  } catch (error) {
    console.error('Error checking conversation access:', error);
    res.status(500).json({ message: 'Ошибка при проверке доступа к диалогу' });
  }
};

// Проверка прав администратора
const checkAdminAccess = async (req, res, next) => {
  try {
    const { userId, userModel } = req.user;
    const { conversationId } = req.params;

    // Проверяем существование диалога
    const conversation = await Conversation.findOne({
      _id: conversationId,
      is_active: true
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Диалог не найден' });
    }

    // Проверяем, приглашен ли администратор в диалог
    if (!conversation.admin_invited) {
      return res.status(403).json({ message: 'Администратор не приглашен в этот диалог' });
    }

    // Проверяем, является ли пользователь администратором
    if (userModel !== 'Admin' && userModel !== 'User') {
      return res.status(403).json({ message: 'Только администраторы могут получить доступ к этому диалогу' });
    }

    // Проверяем, является ли пользователь администратором в системе
    const User = require('../models/User');
    const admin = await User.findOne({ _id: userId, role: 'admin' });
    
    if (!admin) {
      return res.status(403).json({ message: 'У вас нет прав администратора' });
    }

    req.conversation = conversation;
    next();
  } catch (error) {
    console.error('Error checking admin access:', error);
    res.status(500).json({ message: 'Ошибка при проверке прав администратора' });
  }
};

// Проверка прав на приглашение администратора
const checkInviteAdminRights = async (req, res, next) => {
  try {
    const { userId, userModel } = req.user;
    const { conversationId } = req.params;

    // Проверяем существование диалога
    const conversation = await Conversation.findOne({
      _id: conversationId,
      'participants.user_id': userId,
      is_active: true
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Диалог не найден' });
    }

    // Проверяем, что админ еще не приглашен
    if (conversation.admin_invited) {
      return res.status(400).json({ message: 'Администратор уже приглашен в этот диалог' });
    }

    // Проверяем, что пользователь является участником диалога
    const isParticipant = conversation.participants.some(p => 
      p.user_id.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'У вас нет прав для приглашения администратора' });
    }

    req.conversation = conversation;
    next();
  } catch (error) {
    console.error('Error checking invite admin rights:', error);
    res.status(500).json({ message: 'Ошибка при проверке прав на приглашение администратора' });
  }
};

module.exports = {
  checkConversationAccess,
  checkAdminAccess,
  checkInviteAdminRights
}; 