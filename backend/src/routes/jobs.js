const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { auth } = require('../middleware/authMiddleware');

// Публичные маршруты
router.get('/approved', jobController.getApprovedJobs);

// Защищенные маршруты (требуют аутентификации)
router.post('/', auth, jobController.createJob);

// Админские маршруты
router.get('/all', auth, jobController.getAllJobs);
router.get('/pending', auth, jobController.getPendingJobs);
router.put('/:id/approve', auth, jobController.approveJob);
router.put('/:id/reject', auth, jobController.rejectJob);
router.delete('/:id', auth, jobController.deleteJob);

module.exports = router; 