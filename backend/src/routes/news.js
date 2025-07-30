const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { auth, isAdmin } = require('../middleware/authMiddleware');

// Публичные маршруты
router.get('/published', newsController.getPublishedNews);
router.get('/:id', newsController.getNewsById);

// Админские маршруты (требуют авторизации и прав админа)
router.get('/admin/all', auth, isAdmin, newsController.getAllNews);
router.get('/admin/stats', auth, isAdmin, newsController.getNewsStats);
router.post('/admin/scrape', auth, isAdmin, newsController.scrapeNews);
router.post('/admin/:id/approve', auth, isAdmin, newsController.approveNews);
router.post('/admin/:id/reject', auth, isAdmin, newsController.rejectNews);
router.delete('/admin/:id', auth, isAdmin, newsController.deleteNews);

module.exports = router; 