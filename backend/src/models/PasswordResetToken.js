const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'userModel' },
  userModel: { type: String, required: true, enum: ['Investor', 'StartupUser'] },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema); 