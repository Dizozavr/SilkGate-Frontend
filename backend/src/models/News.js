const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    original: { type: String, required: true },
    translated: { type: String, required: true }
  },
  content: {
    original: { type: String, required: true },
    translated: { type: String, required: true }
  },
  summary: {
    original: { type: String },
    translated: { type: String }
  },
  source: {
    name: { type: String, required: true }, // название сайта
    url: { type: String, required: true },  // ссылка на оригинал
    logo: { type: String } // логотип сайта
  },
  image: {
    url: { type: String },
    alt: { type: String }
  },
  category: {
    type: String,
    enum: ['technology', 'startups', 'ai', 'cybersecurity', 'mobile', 'web', 'blockchain', 'cloud', 'quantum', 'fintech', 'other'],
    default: 'technology'
  },
  tags: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  publishedAt: { type: Date },
  approvedBy: { type: String }, // email админа
  approvedAt: { type: Date },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Индексы для быстрого поиска
newsSchema.index({ status: 1, publishedAt: -1 });
newsSchema.index({ category: 1, status: 1 });
newsSchema.index({ tags: 1, status: 1 });

module.exports = mongoose.model('News', newsSchema); 