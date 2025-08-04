const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { auth } = require('../middleware/authMiddleware');
const { 
  checkConversationAccess, 
  checkAdminAccess, 
  checkInviteAdminRights 
} = require('../middleware/conversationAccessMiddleware');

// Все маршруты требуют аутентификации
router.use(auth);

// Получить все диалоги пользователя
router.get('/conversations', chatController.getConversations);

// Создать новый диалог или найти существующий
router.post('/conversations', chatController.createOrGetConversation);

// Получить сообщения диалога (требует доступа к диалогу)
router.get('/conversations/:conversationId/messages', checkConversationAccess, chatController.getMessages);

// Отправить сообщение (требует доступа к диалогу)
router.post('/messages', chatController.sendMessage);

// Пометить сообщения как прочитанные (требует доступа к диалогу)
router.put('/conversations/:conversationId/read', checkConversationAccess, chatController.markAsRead);

// Удалить сообщение
router.delete('/messages/:messageId', chatController.deleteMessage);

// Получить количество непрочитанных сообщений
router.get('/unread-count', chatController.getUnreadCount);

// Пригласить администратора в диалог (требует прав на приглашение)
router.post('/conversations/:conversationId/invite-admin', checkInviteAdminRights, chatController.inviteAdminToConversation);

// Создать чат с администратором (для чат-бота)
router.post('/admin-chat', chatController.createChatWithAdmin);

module.exports = router; 