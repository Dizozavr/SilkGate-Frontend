const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/authMiddleware');

router.use(auth, isAdmin);

router.get('/investors/pending', adminController.getPendingInvestors);
router.post('/investors/:id/approve', adminController.approveInvestor);
router.post('/investors/:id/reject', adminController.rejectInvestor);
router.get('/investors/all', adminController.getAllInvestors);

router.get('/startups/pending', adminController.getPendingStartups);
router.post('/startups/:id/approve', adminController.approveStartup);
router.post('/startups/:id/reject', adminController.rejectStartup);
router.get('/startups/all', adminController.getAllStartups);

module.exports = router; 