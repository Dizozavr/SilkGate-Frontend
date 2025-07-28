const express = require('express');
const router = express.Router();
const investorController = require('../controllers/investorController');
const { auth } = require('../middleware/authMiddleware');

router.post('/register', investorController.register);
router.get('/verify/:token', investorController.verifyEmail);
router.post('/interests', auth, investorController.addInterest);
router.get('/interests', auth, investorController.getInterests);
router.delete('/interests/:startupId', auth, investorController.removeInterest);
router.post('/forgot-password', investorController.forgotPassword);
router.post('/reset-password/:token', investorController.resetPassword);
router.get('/me', auth, investorController.me);

module.exports = router; 