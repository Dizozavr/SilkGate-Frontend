const mongoose = require('mongoose');

const investmentRangeSchema = new mongoose.Schema({
  min: Number,
  max: Number
}, { _id: false });

const contactLinksSchema = new mongoose.Schema({
  linkedin: String,
  telegram: String
}, { _id: false });

const investorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  location: { type: String },
  investorType: { type: String },
  investmentRange: investmentRangeSchema,
  interests: [{ type: String }],
  preferredStages: [{ type: String }],
  geoFocus: [{ type: String }],
  dealType: [{ type: String }],
  publicProfile: { type: Boolean, default: false },
  bio: { type: String },
  contactLinks: contactLinksSchema,
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  ndaAccepted: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Investor', investorSchema); 