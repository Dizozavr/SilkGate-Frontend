const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { auth } = require('../middleware/authMiddleware');

// Все маршруты требуют аутентификации
router.use(auth);

// Получить все диалоги пользователя
router.get('/conversations', chatController.getConversations);

// Создать новый диалог или найти существующий
router.post('/conversations', chatController.createOrGetConversation);

// Получить сообщения диалога
router.get('/conversations/:conversationId/messages', chatController.getMessages);

// Отправить сообщение
router.post('/messages', chatController.sendMessage);

// Пометить сообщения как прочитанные
router.put('/conversations/:conversationId/read', chatController.markAsRead);

// Удалить сообщение
router.delete('/messages/:messageId', chatController.deleteMessage);

// Получить количество непрочитанных сообщений
router.get('/unread-count', chatController.getUnreadCount);

module.exports = router; 