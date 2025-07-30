const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  txn_id: {
    type: String,
    required: true,
    unique: true
  },
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
  subscription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  plan_id: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  original_amount: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  payment_provider: {
    type: String,
    required: true,
    enum: ['stripe', 'paypal', 'bank_transfer', 'demo'],
    default: 'demo'
  },
  payment_method: {
    type: String,
    enum: ['card', 'bank_transfer', 'paypal', 'demo']
  },
  provider_transaction_id: {
    type: String
  },
  description: {
    type: String
  },
  // Поля для скидок
  discount_applied: {
    type: Number,
    default: null
  },
  discount_amount: {
    type: Number,
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  error_message: {
    type: String
  }
}, {
  timestamps: true
});

// Индексы для быстрого поиска
transactionSchema.index({ user_id: 1, created_at: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ payment_provider: 1 });

// Статический метод для генерации уникального txn_id
transactionSchema.statics.generateTxnId = function() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `txn_${timestamp}_${random}`;
};

// Метод для обновления статуса транзакции
transactionSchema.methods.updateStatus = function(status, errorMessage = null) {
  this.status = status;
  if (errorMessage) {
    this.error_message = errorMessage;
  }
  return this.save();
};

module.exports = mongoose.model('Transaction', transactionSchema); 