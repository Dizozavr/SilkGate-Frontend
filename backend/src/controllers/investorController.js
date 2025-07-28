const Investor = require('../models/Investor');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('../services/emailService');
const InvestorInterest = require('../models/InvestorInterest');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    let { name, email, location, investmentRange, interests, password, ndaAccepted } = req.body;

    if (typeof investmentRange === 'string') {
      try {
        investmentRange = JSON.parse(investmentRange);
      } catch {
        return res.status(400).json({ message: 'investmentRange должен быть объектом.' });
      }
    }

    if (
      !investmentRange ||
      typeof investmentRange !== 'object' ||
      typeof investmentRange.min !== 'number' ||
      typeof investmentRange.max !== 'number'
    ) {
      return res.status(400).json({ message: 'investmentRange должен быть объектом с min и max (числа).' });
    }

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
    const token = signToken({ id: investor._id, email: investor.email, name: investor.name }, '1d');
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

// POST /api/investors/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const investor = await Investor.findOne({ email });
    if (!investor) return res.status(200).json({ message: 'Если email зарегистрирован, инструкция отправлена.' });
    const token = signToken({ id: investor._id, email: investor.email }, '1h');
    const link = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${token}`;
    // Отправить email
    const { sendVerificationEmail } = require('../services/emailService');
    await sendVerificationEmail(investor.email, `<p>Для сброса пароля перейдите по ссылке:</p><a href='${link}'>${link}</a>`);
    res.json({ message: 'Если email зарегистрирован, инструкция отправлена.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/investors/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Пароль обязателен' });
    const { verifyToken } = require('../utils/jwt');
    const payload = verifyToken(token);
    const investor = await Investor.findById(payload.id);
    if (!investor) return res.status(400).json({ message: 'Invalid or expired token.' });
    investor.password = await require('bcryptjs').hash(password, 10);
    await investor.save();
    res.json({ message: 'Пароль успешно изменён.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

// POST /api/investors/interests
exports.addInterest = async (req, res) => {
  try {
    const investorId = req.user.id;
    const { startupId } = req.body;
    if (!startupId) return res.status(400).json({ message: 'startupId required' });
    await InvestorInterest.findOneAndUpdate(
      { investorId, startupId },
      { investorId, startupId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ message: 'Interest added' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/investors/interests
exports.getInterests = async (req, res) => {
  try {
    const investorId = req.user.id;
    const interests = await InvestorInterest.find({ investorId }).populate('startupId');
    res.json(interests.map(i => i.startupId));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/investors/interests/:startupId
exports.removeInterest = async (req, res) => {
  try {
    const investorId = req.user.id;
    const { startupId } = req.params;
    await InvestorInterest.deleteOne({ investorId, startupId });
    res.json({ message: 'Interest removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/investors/me
exports.me = async (req, res) => {
  try {
    const investor = await Investor.findById(req.user.id);
    if (!investor) return res.status(404).json({ message: 'Инвестор не найден' });
    res.json(investor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 