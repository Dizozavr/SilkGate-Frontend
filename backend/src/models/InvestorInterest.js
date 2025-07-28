const mongoose = require('mongoose');

const investorInterestSchema = new mongoose.Schema({
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor', required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  createdAt: { type: Date, default: Date.now }
});

investorInterestSchema.index({ investorId: 1, startupId: 1 }, { unique: true });

module.exports = mongoose.model('InvestorInterest', investorInterestSchema); 