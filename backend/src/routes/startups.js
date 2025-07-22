const express = require('express');
const router = express.Router();
const startupController = require('../controllers/startupController');

router.post('/register', startupController.register);

module.exports = router; 