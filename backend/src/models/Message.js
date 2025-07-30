const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'sender.user_model',
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
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  message_type: {
    type: String,
    enum: ['text', 'image', 'file', 'link'],
    default: 'text'
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    mime_type: String
  }],
  is_read: {
    type: Boolean,
    default: false
  },
  read_at: {
    type: Date
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  deleted_at: {
    type: Date
  },
  reply_to: {
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    content: String
  }
}, {
  timestamps: true
});

// Индексы для быстрого поиска
messageSchema.index({ conversation_id: 1, created_at: -1 });
messageSchema.index({ 'sender.user_id': 1 });
messageSchema.index({ is_read: 1 });

// Виртуальное поле для времени отправки
messageSchema.virtual('time_ago').get(function() {
  const now = new Date();
  const diff = now - this.created_at;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} дн. назад`;
  if (hours > 0) return `${hours} ч. назад`;
  if (minutes > 0) return `${minutes} мин. назад`;
  return 'Только что';
});

// Метод для пометки сообщения как прочитанного
messageSchema.methods.markAsRead = function() {
  this.is_read = true;
  this.read_at = new Date();
  return this.save();
};

// Метод для мягкого удаления сообщения
messageSchema.methods.softDelete = function() {
  this.is_deleted = true;
  this.deleted_at = new Date();
  return this.save();
};

// Статический метод для получения непрочитанных сообщений
messageSchema.statics.getUnreadCount = function(userId, conversationId) {
  return this.countDocuments({
    conversation_id: conversationId,
    'sender.user_id': { $ne: userId },
    is_read: false,
    is_deleted: false
  });
};

module.exports = mongoose.model('Message', messageSchema); 