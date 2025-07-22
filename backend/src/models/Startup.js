const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  industry: { type: String },
  location: { type: String },
  fundingAmount: { type: Number },
  pitchDeckUrl: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Startup', startupSchema); 