const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const UsageTracking = require('../models/UsageTracking');

// Middleware для проверки лимитов просмотра проектов
const checkProjectViewLimit = async (req, res, next) => {
  try {
    const { userId, userModel } = req.user;

    // Получаем текущую подписку
    const subscription = await Subscription.findOne({
      user_id: userId,
      user_model: userModel,
      is_active: true
    });

    if (!subscription) {
      return res.status(403).json({ 
        message: 'Подписка не найдена',
        upgrade_required: true 
      });
    }

    // Получаем план
    const plan = await Plan.findOne({ id: subscription.plan_id });
    if (!plan) {
      return res.status(403).json({ 
        message: 'План не найден',
        upgrade_required: true 
      });
    }

    // Проверяем лимит просмотров
    const dailyUsage = await UsageTracking.getDailyUsage(userId, 'project_view');
    const limit = plan.limits.project_views_per_day;

    if (limit !== -1 && dailyUsage >= limit) {
      return res.status(403).json({
        message: `Достигнут дневной лимит просмотров проектов (${limit}). Обновите план для неограниченного доступа.`,
        upgrade_required: true,
        current_usage: dailyUsage,
        limit: limit,
        plan: plan.name
      });
    }

    // Отслеживаем использование
    await UsageTracking.addUsage(userId, userModel, 'project_view', 1, {
      project_id: req.params.id || req.body.projectId,
      timestamp: new Date()
    });

    next();
  } catch (error) {
    console.error('Error checking project view limit:', error);
    next(); // Пропускаем в случае ошибки
  }
};

// Middleware для проверки доступа к контактам
const checkContactAccess = async (req, res, next) => {
  try {
    const { userId, userModel } = req.user;

    const subscription = await Subscription.findOne({
      user_id: userId,
      user_model: userModel,
      is_active: true
    });

    if (!subscription) {
      return res.status(403).json({ 
        message: 'Подписка не найдена',
        upgrade_required: true 
      });
    }

    const plan = await Plan.findOne({ id: subscription.plan_id });
    if (!plan) {
      return res.status(403).json({ 
        message: 'План не найден',
        upgrade_required: true 
      });
    }

    if (!plan.limits.startup_contacts_visible) {
      return res.status(403).json({
        message: 'Просмотр контактов недоступен в вашем плане. Обновите план для доступа к контактам стартапов.',
        upgrade_required: true,
        current_plan: plan.name
      });
    }

    // Отслеживаем использование
    await UsageTracking.addUsage(userId, userModel, 'contact_view', 1, {
      startup_id: req.params.id || req.body.startupId,
      timestamp: new Date()
    });

    next();
  } catch (error) {
    console.error('Error checking contact access:', error);
    next();
  }
};

// Middleware для проверки доступа к экспорту
const checkExportAccess = async (req, res, next) => {
  try {
    const { userId, userModel } = req.user;

    const subscription = await Subscription.findOne({
      user_id: userId,
      user_model: userModel,
      is_active: true
    });

    if (!subscription) {
      return res.status(403).json({ 
        message: 'Подписка не найдена',
        upgrade_required: true 
      });
    }

    const plan = await Plan.findOne({ id: subscription.plan_id });
    if (!plan) {
      return res.status(403).json({ 
        message: 'План не найден',
        upgrade_required: true 
      });
    }

    if (!plan.limits.can_export) {
      return res.status(403).json({
        message: 'Экспорт данных недоступен в вашем плане. Обновите план для доступа к экспорту.',
        upgrade_required: true,
        current_plan: plan.name
      });
    }

    // Отслеживаем использование
    await UsageTracking.addUsage(userId, userModel, 'export', 1, {
      export_type: req.body.exportType || 'general',
      timestamp: new Date()
    });

    next();
  } catch (error) {
    console.error('Error checking export access:', error);
    next();
  }
};

// Middleware для проверки доступа к приватным сделкам
const checkPrivateDealsAccess = async (req, res, next) => {
  try {
    const { userId, userModel } = req.user;

    const subscription = await Subscription.findOne({
      user_id: userId,
      user_model: userModel,
      is_active: true
    });

    if (!subscription) {
      return res.status(403).json({ 
        message: 'Подписка не найдена',
        upgrade_required: true 
      });
    }

    const plan = await Plan.findOne({ id: subscription.plan_id });
    if (!plan) {
      return res.status(403).json({ 
        message: 'План не найден',
        upgrade_required: true 
      });
    }

    if (!plan.limits.access_private_deals) {
      return res.status(403).json({
        message: 'Доступ к приватным сделкам недоступен в вашем плане. Обновите план Partner+ для доступа.',
        upgrade_required: true,
        current_plan: plan.name
      });
    }

    next();
  } catch (error) {
    console.error('Error checking private deals access:', error);
    next();
  }
};

// Middleware для получения информации о подписке
const getSubscriptionInfo = async (req, res, next) => {
  try {
    const { userId, userModel } = req.user;

    const subscription = await Subscription.findOne({
      user_id: userId,
      user_model: userModel,
      is_active: true
    });

    if (subscription) {
      const plan = await Plan.findOne({ id: subscription.plan_id });
      req.subscriptionInfo = {
        subscription,
        plan,
        is_expired: subscription.expires_at < new Date(),
        is_valid: subscription.is_active && subscription.expires_at > new Date()
      };
    } else {
      req.subscriptionInfo = {
        subscription: null,
        plan: null,
        is_expired: false,
        is_valid: false
      };
    }

    next();
  } catch (error) {
    console.error('Error getting subscription info:', error);
    req.subscriptionInfo = {
      subscription: null,
      plan: null,
      is_expired: false,
      is_valid: false
    };
    next();
  }
};

module.exports = {
  checkProjectViewLimit,
  checkContactAccess,
  checkExportAccess,
  checkPrivateDealsAccess,
  getSubscriptionInfo
}; 