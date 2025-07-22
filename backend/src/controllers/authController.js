const Investor = require('../models/Investor');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await Investor.findOne({ email });
    let role = 'investor';
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
    const token = signToken({ id: user._id, role });
    res.json({ token, role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 