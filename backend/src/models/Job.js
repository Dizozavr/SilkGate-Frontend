const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedBy: {
    type: String, // email пользователя
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: String // email админа
  },
  location: {
    type: String,
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  requirements: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Job', jobSchema); 