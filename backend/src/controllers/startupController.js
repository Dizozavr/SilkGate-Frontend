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