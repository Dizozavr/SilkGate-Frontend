const mongoose = require('mongoose');

const usageTrackingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'user_model',
    required: true
  },
  user_model: {
    type: String,
    required: true,
    enum: ['Investor', 'Admin', 'Startup', 'User']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  usage_type: {
    type: String,
    required: true,
    enum: ['project_view', 'contact_view', 'export', 'api_call']
  },
  count: {
    type: Number,
    required: true,
    default: 1
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Индексы для быстрого поиска
usageTrackingSchema.index({ user_id: 1, date: 1, usage_type: 1 });
usageTrackingSchema.index({ date: 1 });

// Статический метод для получения дневного использования
usageTrackingSchema.statics.getDailyUsage = async function(userId, usageType, date = new Date()) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const usage = await this.aggregate([
    {
      $match: {
        user_id: mongoose.Types.ObjectId(userId),
        usage_type: usageType,
        date: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $group: {
        _id: null,
        total_count: { $sum: '$count' }
      }
    }
  ]);

  return usage.length > 0 ? usage[0].total_count : 0;
};

// Статический метод для добавления использования
usageTrackingSchema.statics.addUsage = async function(userId, userModel, usageType, count = 1, details = {}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Ищем существующую запись за сегодня
  let usage = await this.findOne({
    user_id: userId,
    user_model: userModel,
    usage_type: usageType,
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  });

  if (usage) {
    // Обновляем существующую запись
    usage.count += count;
    if (details && Object.keys(details).length > 0) {
      usage.details = { ...usage.details, ...details };
    }
    await usage.save();
  } else {
    // Создаем новую запись
    usage = new this({
      user_id: userId,
      user_model: userModel,
      usage_type: usageType,
      count: count,
      details: details,
      date: today
    });
    await usage.save();
  }

  return usage;
};

module.exports = mongoose.model('UsageTracking', usageTrackingSchema); 