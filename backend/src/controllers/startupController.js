const Startup = require('../models/Startup');

exports.register = async (req, res) => {
  try {
    const { name, description, industry, location, fundingAmount, pitchDeckUrl } = req.body;
    const startup = new Startup({
      name,
      description,
      industry,
      location,
      fundingAmount,
      pitchDeckUrl
    });
    await startup.save();
    res.status(201).json({ message: 'Startup submitted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getApproved = async (req, res) => {
  try {
    const startups = await Startup.find({ status: 'approved' });
    res.json(startups);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createByStartupUser = async (req, res) => {
  try {
    const startupUserId = req.user.id;
    const { name, description, industry, location, fundingAmount, pitchDeckUrl } = req.body;
    const startup = new Startup({
      name,
      description,
      industry,
      location,
      fundingAmount,
      pitchDeckUrl,
      startupUserId
    });
    await startup.save();
    res.status(201).json({ message: 'Startup submitted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyStartups = async (req, res) => {
  try {
    const startupUserId = req.user.id;
    const startups = await Startup.find({ startupUserId });
    res.json(startups);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Поиск стартапов для чатов
exports.searchStartups = async (req, res) => {
  try {
    const { q } = req.query;
    const { userModel } = req.user;

    // Проверяем права доступа - только инвесторы и админы могут искать стартапы
    if (userModel !== 'Investor' && userModel !== 'Admin') {
      return res.status(403).json({ 
        message: 'Только инвесторы и администраторы могут искать стартапы' 
      });
    }

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const searchRegex = new RegExp(q, 'i');
    const startups = await Startup.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { industry: searchRegex }
      ],
      status: 'approved'
    })
    .select('name description industry location')
    .limit(10);

    res.json(startups);
  } catch (err) {
    console.error('Error searching startups:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 