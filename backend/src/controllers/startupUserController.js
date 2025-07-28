const StartupUser = require('../models/StartupUser');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('../services/emailService');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await StartupUser.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new StartupUser({ name, email, password: hashedPassword });
    await user.save();
    const token = signToken({ id: user._id, email: user.email, name: user.name }, '1d');
    const link = `${process.env.CLIENT_URL || 'http://localhost:3000'}/startup-verify-email/${token}`;
    await sendVerificationEmail(user.email, link);
    res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const { verifyToken } = require('../utils/jwt');
    const payload = verifyToken(token);
    const user = await StartupUser.findById(payload.id);
    if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });
    if (user.emailVerified) return res.status(400).json({ message: 'Email already verified.' });
    user.emailVerified = true;
    await user.save();
    res.json({ message: 'Email verified successfully.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await StartupUser.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });
    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Account not verified.' });
    }
    const token = signToken({ id: user._id, role: 'startup', name: user.name, email: user.email });
    res.json({ token, role: 'startup' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 