const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['investor', 'startup'],
    required: true,
    default: 'investor'
  },
  price: {
    monthly: {
      type: Number,
      required: true,
      default: 0
    },
    yearly: {
      type: Number,
      required: true,
      default: 0
    }
  },
  limits: {
    project_views_per_day: {
      type: Number,
      default: 0
    },
    startup_contacts_visible: {
      type: Boolean,
      default: false
    },
    can_export: {
      type: Boolean,
      default: false
    },
    can_submit_interest: {
      type: Boolean,
      default: true
    },
    access_private_deals: {
      type: Boolean,
      default: false
    }
  },
  features: [{
    type: String
  }],
  discounts: {
    startup_age_months: {
      type: Number,
      default: null
    },
    discount_percent: {
      type: Number,
      default: 0
    }
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', planSchema); 