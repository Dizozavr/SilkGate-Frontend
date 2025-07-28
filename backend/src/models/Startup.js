const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  linkedin: String
}, { _id: false });

const linksSchema = new mongoose.Schema({
  website: String,
  pitchDeck: String,
  prototype: String
}, { _id: false });

const startupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String },
  stage: { type: String },
  fundingAmount: { type: Number },
  fundingGoal: { type: Number },
  equityOffered: { type: Number },
  shortDescription: { type: String },
  fullDescription: { type: String },
  team: [teamMemberSchema],
  hasLegalEntity: { type: Boolean },
  hasRevenue: { type: Boolean },
  hasMVP: { type: Boolean },
  links: linksSchema,
  location: { type: String },
  pitchDeckUrl: { type: String },
  startupUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'StartupUser' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'archived'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Startup', startupSchema); 