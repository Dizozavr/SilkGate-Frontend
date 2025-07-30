const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Статические файлы для изображений
app.use('/images', express.static('public/images'));

const investorRoutes = require('./routes/investors');
const startupRoutes = require('./routes/startups');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const startupUserRoutes = require('./routes/startupUsers');
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/jobs');
const newsRoutes = require('./routes/news');
const subscriptionRoutes = require('./routes/subscriptions');
const chatRoutes = require('./routes/chat');

app.use('/api/investors', investorRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/startup-users', startupUserRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SilkGate backend is running.' });
});

module.exports = app; 