const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { auth } = require('../middleware/authMiddleware');

// Публичные маршруты
router.get('/plans', subscriptionController.getPlans);
router.post('/initialize-demo', subscriptionController.initializeDemoPlans);

// Защищенные маршруты (требуют аутентификации)
router.get('/current', auth, subscriptionController.getCurrentSubscription);
router.post('/create', auth, subscriptionController.createSubscription);
router.post('/cancel', auth, subscriptionController.cancelSubscription);
router.get('/transactions', auth, subscriptionController.getTransactionHistory);
router.get('/limits/:usageType', auth, subscriptionController.checkUserLimits);
router.post('/track-usage', auth, subscriptionController.trackUsage);

module.exports = router; 