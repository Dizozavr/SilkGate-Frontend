const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const investorRoutes = require('./routes/investors');
const startupRoutes = require('./routes/startups');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const startupUserRoutes = require('./routes/startupUsers');

app.use('/api/investors', investorRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/startup-users', startupUserRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SilkGate backend is running.' });
});

module.exports = app; 