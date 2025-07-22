const express = require('express');
const router = express.Router();
const investorController = require('../controllers/investorController');

router.post('/register', investorController.register);
router.get('/verify/:token', investorController.verifyEmail);

module.exports = router; 