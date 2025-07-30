const express = require('express');
const router = express.Router();
const startupController = require('../controllers/startupController');
const { auth } = require('../middleware/authMiddleware');
const StartupUser = require('../models/StartupUser');

router.post('/register', startupController.register);
router.get('/approved', startupController.getApproved);
router.post('/my', auth, startupController.createByStartupUser);
router.get('/my', auth, startupController.getMyStartups);
router.get('/search', auth, startupController.searchStartups);

// Создание стартапа стартап-юзером
router.post('/create', auth, async (req, res) => {
  try {
    // Проверяем, что пользователь — стартап-юзер
    if (!req.user || req.user.role !== 'startup') {
      return res.status(403).json({ message: 'Только для стартап-юзеров' });
    }
    const { name, description, industry, location, fundingAmount, pitchDeckUrl } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Название и описание обязательны' });
    }
    const startup = new (require('../models/Startup'))({
      name,
      description,
      industry,
      location,
      fundingAmount,
      pitchDeckUrl,
      startupUserId: req.user.id,
      status: 'pending',
    });
    await startup.save();
    res.status(201).json({ message: 'Стартап создан и отправлен на модерацию', startup });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// Обновление стартапа (только владелец)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'startup') {
      return res.status(403).json({ message: 'Только для стартап-юзеров' });
    }
    const { id } = req.params;
    const update = req.body;
    const startup = await require('../models/Startup').findOneAndUpdate(
      { _id: id, startupUserId: req.user.id },
      update,
      { new: true }
    );
    if (!startup) return res.status(404).json({ message: 'Стартап не найден или нет доступа' });
    res.json({ message: 'Стартап обновлён', startup });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

module.exports = router; 