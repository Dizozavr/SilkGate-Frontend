const Investor = require('../models/Investor');
const Admin = require('../models/Admin');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');
const StartupUser = require('../models/StartupUser');
const PasswordResetToken = require('../models/PasswordResetToken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Проверка админа через .env
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = signToken({ id: 'admin', role: 'admin' });
      return res.json({ token, role: 'admin' });
    }
    let user = await StartupUser.findOne({ email });
    let role = 'startup';
    if (!user) {
      user = await Investor.findOne({ email });
      role = 'investor';
    }
    if (!user) {
      user = await User.findOne({ email });
      role = 'user';
    }
    if (!user) {
      user = await Admin.findOne({ email });
      role = 'admin';
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    if (role === 'investor' && (!user.emailVerified || user.status !== 'approved')) {
      return res.status(403).json({ message: 'Account not verified or not approved.' });
    }
    if (role === 'startup' && !user.emailVerified) {
      return res.status(403).json({ message: 'Account not verified.' });
    }
    const token = signToken(role === 'investor' ? { id: user._id, role, name: user.name, email: user.email } : { id: user._id, role });
    res.json({ token, role, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email обязателен.' });
    }
    let user = await Investor.findOne({ email });
    let userType = 'Investor';
    if (!user) {
      user = await StartupUser.findOne({ email });
      userType = 'StartupUser';
    }
    if (!user) {
      user = await User.findOne({ email });
      userType = 'User';
    }
    if (!user) {
      return res.status(404).json({ message: 'Такой email не зарегистрирован' });
    }
    // Генерируем токен
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 час
    await PasswordResetToken.deleteMany({ userId: user._id, userModel: userType });
    await PasswordResetToken.create({ userId: user._id, userModel: userType, token, expiresAt });
    const link = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${token}?type=${userType}`;
    await sendPasswordResetEmail(user.email, link);
    console.log('Ссылка для сброса пароля отправлена:', link);
    res.json({ message: 'Письмо для сброса пароля отправлено.' });
  } catch (err) {
    console.error('Ошибка forgotPassword:', err);
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, userType } = req.body;
    if (!token || !password || !userType) {
      return res.status(400).json({ message: 'token, password, userType обязательны.' });
    }
    // Валидация пароля
    if (typeof password !== 'string' || password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Пароль должен содержать минимум 8 символов, латиницу и цифры.' });
    }
    const resetToken = await PasswordResetToken.findOne({ token, userModel: userType });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Токен недействителен или истёк.' });
    }
    const UserModel = userType === 'Investor' ? Investor : userType === 'StartupUser' ? StartupUser : User;
    const user = await UserModel.findById(resetToken.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await PasswordResetToken.deleteMany({ userId: user._id, userModel: userType });
    console.log('Пароль успешно сброшен для:', user.email);
    res.json({ message: 'Пароль успешно сброшен.' });
  } catch (err) {
    console.error('Ошибка resetPassword:', err);
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
}; 