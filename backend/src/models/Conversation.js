const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'participants.user_model',
      required: true
    },
    user_model: {
      type: String,
      required: true,
      enum: ['Investor', 'Admin', 'Startup', 'User']
    },
    username: {
      type: String,
      required: true
    }
  }],
  // Безопасность: админ приглашен только по запросу
  admin_invited: {
    type: Boolean,
    default: false
  },
  admin_invited_by: {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'participants.user_model'
    },
    user_model: {
      type: String,
      enum: ['Investor', 'Admin', 'Startup', 'User']
    },
    timestamp: {
      type: Date
    }
  },
  // Шифрование: ключ для расшифровки сообщений
  encryption_key_hash: {
    type: String,
    required: true
  },
  last_message: {
    encrypted_content: String, // Зашифрованное содержимое
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'participants.user_model'
    },
    sender_model: {
      type: String,
      enum: ['Investor', 'Admin', 'Startup', 'User']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  unread_count: {
    type: Map,
    of: Number,
    default: new Map()
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Индекс для быстрого поиска диалогов пользователя
conversationSchema.index({ 'participants.user_id': 1 });

// Метод для получения собеседника
conversationSchema.methods.getOtherParticipant = function(userId) {
  return this.participants.find(p => p.user_id.toString() !== userId.toString());
};

// Метод для обновления счетчика непрочитанных
conversationSchema.methods.incrementUnreadCount = function(userId) {
  const currentCount = this.unread_count.get(userId.toString()) || 0;
  this.unread_count.set(userId.toString(), currentCount + 1);
  return this.save();
};

// Метод для сброса счетчика непрочитанных
conversationSchema.methods.resetUnreadCount = function(userId) {
  this.unread_count.set(userId.toString(), 0);
  return this.save();
};

module.exports = mongoose.model('Conversation', conversationSchema); 