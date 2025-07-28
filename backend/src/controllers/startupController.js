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