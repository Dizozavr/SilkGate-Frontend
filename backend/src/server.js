const mongoose = require('mongoose');
const app = require('./app');
const cronArchiveStartups = require('./cronArchiveStartups');
const { startNewsCron } = require('./cronNewsScraper');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    
    // Запускаем cron-задачи
    cronArchiveStartups.startArchiveCron();
    // startNewsCron(); // Временно отключено в демо-версии
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 