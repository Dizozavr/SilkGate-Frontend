const Investor = require('../models/Investor');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('../services/emailService');

exports.register = async (req, res) => {
  try {
    const { name, email, location, investmentRange, interests, password, ndaAccepted } = req.body;
    if (!ndaAccepted) {
      return res.status(400).json({ message: 'NDA must be accepted.' });
    }
    const existing = await Investor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const investor = new Investor({
      name,
      email,
      location,
      investmentRange,
      interests,
      password: hashedPassword,
      ndaAccepted
    });
    await investor.save();
    // Генерируем токен для email-верификации (действителен 1 день)
    const token = signToken({ id: investor._id, email: investor.email }, '1d');
    const link = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${token}`;
    await sendVerificationEmail(investor.email, link);
    res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (err) {
    console.error(err); // <-- это важно для логирования!
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const { verifyToken } = require('../utils/jwt');
    const payload = verifyToken(token);
    const investor = await Investor.findById(payload.id);
    if (!investor) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }
    if (investor.emailVerified) {
      return res.status(400).json({ message: 'Email already verified.' });
    }
    investor.emailVerified = true;
    await investor.save();
    res.json({ message: 'Email verified successfully.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
}; 