const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
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
  plan_id: {
    type: String,
    required: true
  },
  started_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  expires_at: {
    type: Date,
    required: true
  },
  is_trial: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  auto_renew: {
    type: Boolean,
    default: true
  },
  payment_method: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer', 'demo'],
    default: 'demo'
  },
  // Поля для скидок
  original_price: {
    type: Number,
    default: 0
  },
  discounted_price: {
    type: Number,
    default: 0
  },
  discount_percent: {
    type: Number,
    default: 0
  },
  last_payment_date: {
    type: Date
  },
  next_payment_date: {
    type: Date
  }
}, {
  timestamps: true
});

// Индексы для быстрого поиска
subscriptionSchema.index({ user_id: 1, is_active: 1 });
subscriptionSchema.index({ expires_at: 1 });

// Виртуальное поле для проверки истечения подписки
subscriptionSchema.virtual('is_expired').get(function() {
  return this.expires_at < new Date();
});

// Виртуальное поле для проверки активной подписки
subscriptionSchema.virtual('is_valid').get(function() {
  return this.is_active && !this.is_expired;
});

// Метод для продления подписки
subscriptionSchema.methods.extend = function(months = 1) {
  const newExpiry = new Date(this.expires_at);
  newExpiry.setMonth(newExpiry.getMonth() + months);
  this.expires_at = newExpiry;
  this.is_active = true;
  return this.save();
};

// Метод для отмены подписки
subscriptionSchema.methods.cancel = function() {
  this.auto_renew = false;
  this.is_active = false;
  return this.save();
};

module.exports = mongoose.model('Subscription', subscriptionSchema); 