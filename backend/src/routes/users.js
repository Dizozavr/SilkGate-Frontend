const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/authMiddleware');

// Регистрация обычного пользователя
router.post('/register', userController.register);

// Получение профиля (требует авторизации)
router.get('/profile', auth, userController.getProfile);

// Обновление профиля (требует авторизации)
router.put('/profile', auth, userController.updateProfile);

module.exports = router; 