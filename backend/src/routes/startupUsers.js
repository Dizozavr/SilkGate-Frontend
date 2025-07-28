const express = require('express');
const router = express.Router();
const startupUserController = require('../controllers/startupUserController');

router.post('/register', startupUserController.register);
router.get('/verify/:token', startupUserController.verifyEmail);
router.post('/login', startupUserController.login);

module.exports = router; 