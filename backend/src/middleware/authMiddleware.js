const { verifyToken } = require('../utils/jwt');
const Investor = require('../models/Investor');
const Admin = require('../models/Admin');

async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    // Если это стартап-юзер, явно проставляем роль
    if (!req.user.role && payload.email) {
      const StartupUser = require('../models/StartupUser');
      const user = await StartupUser.findOne({ email: payload.email });
      if (user) req.user.role = 'startup';
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
}

module.exports = { auth, isAdmin }; 