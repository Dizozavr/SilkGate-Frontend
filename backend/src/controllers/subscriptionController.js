const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');
const UsageTracking = require('../models/UsageTracking');
const Investor = require('../models/Investor');
const User = require('../models/User');

// Получить все планы с фильтрацией по типу пользователя
const getPlans = async (req, res) => {
  try {
    const { userType } = req.query;
    let query = { is_active: true };
    
    // Фильтруем по типу пользователя если указан
    if (userType) {
      query.userType = userType;
    }
    
    const plans = await Plan.find(query).sort({ 'price.monthly': 1 });
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: 'Ошибка при получении планов' });
  }
};

// Получить текущую подписку пользователя
const getCurrentSubscription = async (req, res) => {
  try {
    const { userId, userModel } = req.user;

    let subscription = await Subscription.findOne({
      user_id: userId,
      user_model: userModel,
      is_active: true
    }).sort({ created_at: -1 });

    // Если подписки нет, создаем бесплатную
    if (!subscription) {
      subscription = new Subscription({
        user_id: userId,
        user_model: userModel,
        plan_id: 'free',
        started_at: new Date(),
        expires_at: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // 100 лет
        is_trial: false,
        is_active: true,
        payment_method: 'demo'
      });
      await subscription.save();
    }

    // Получаем план
    const plan = await Plan.findOne({ id: subscription.plan_id });

    res.json({
      subscription,
      plan,
      is_expired: subscription.expires_at < new Date(),
      is_valid: subscription.is_active && subscription.expires_at > new Date()
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ message: 'Ошибка при получении подписки' });
  }
};

// Вычислить скидку для стартапа
const calculateDiscount = async (plan, userId, userModel) => {
  if (!plan.discounts || !plan.discounts.discount_percent) {
    return 0;
  }

  try {
    // Получаем информацию о стартапе
    let user;
    if (userModel === 'User') {
      user = await User.findById(userId);
    } else if (userModel === 'Investor') {
      user = await Investor.findById(userId);
    }

    if (!user || !user.created_at) {
      return 0;
    }

    // Вычисляем возраст стартапа в месяцах
    const startupAge = Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 30));
    
    // Проверяем, подходит ли стартап под условия скидки
    if (startupAge <= plan.discounts.startup_age_months) {
      return plan.discounts.discount_percent;
    }

    return 0;
  } catch (error) {
    console.error('Error calculating discount:', error);
    return 0;
  }
};

// Создать подписку (демо-версия)
const createSubscription = async (req, res) => {
  try {
    const { planId, period = 'monthly', paymentMethod = 'demo' } = req.body;
    const { userId, userModel } = req.user;

    // Проверяем существование плана
    const plan = await Plan.findOne({ id: planId, is_active: true });
    if (!plan) {
      return res.status(400).json({ message: 'План не найден' });
    }

    // Вычисляем скидку
    const discountPercent = await calculateDiscount(plan, userId, userModel);
    
    // Вычисляем цену с учетом скидки
    const originalPrice = period === 'yearly' ? plan.price.yearly : plan.price.monthly;
    const discountedPrice = originalPrice * (1 - discountPercent / 100);

    // Отменяем текущую активную подписку
    await Subscription.updateMany(
      { user_id: userId, user_model: userModel, is_active: true },
      { is_active: false }
    );

    // Вычисляем дату истечения
    const now = new Date();
    const expiresAt = new Date(now);
    if (period === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    // Создаем новую подписку
    const subscription = new Subscription({
      user_id: userId,
      user_model: userModel,
      plan_id: planId,
      started_at: now,
      expires_at: expiresAt,
      is_trial: false,
      is_active: true,
      payment_method: paymentMethod,
      original_price: originalPrice,
      discounted_price: discountedPrice,
      discount_percent: discountPercent
    });

    await subscription.save();

    // Создаем транзакцию
    const transaction = new Transaction({
      txn_id: Transaction.generateTxnId(),
      user_id: userId,
      user_model: userModel,
      subscription_id: subscription._id,
      plan_id: planId,
      amount: discountedPrice,
      original_amount: originalPrice,
      currency: 'USD',
      payment_provider: paymentMethod,
      payment_method: paymentMethod,
      status: 'completed',
      description: `Подписка на план ${plan.name} (${period})`,
      discount_applied: discountPercent > 0 ? discountPercent : null,
      discount_amount: originalPrice - discountedPrice
    });

    await transaction.save();

    res.json({
      message: 'Подписка успешно создана',
      subscription,
      transaction,
      discount_applied: discountPercent > 0 ? discountPercent : null
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Ошибка при создании подписки' });
  }
};

// Отменить подписку
const cancelSubscription = async (req, res) => {
  try {
    const { userId, userModel } = req.user;

    const subscription = await Subscription.findOne({
      user_id: userId,
      user_model: userModel,
      is_active: true
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Активная подписка не найдена' });
    }

    subscription.auto_renew = false;
    subscription.is_active = false;
    await subscription.save();

    res.json({
      message: 'Подписка отменена',
      subscription
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ message: 'Ошибка при отмене подписки' });
  }
};

// Получить историю транзакций
const getTransactionHistory = async (req, res) => {
  try {
    const { userId, userModel } = req.user;
    const { page = 1, limit = 10 } = req.query;

    const transactions = await Transaction.find({
      user_id: userId,
      user_model: userModel
    })
    .sort({ created_at: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Transaction.countDocuments({
      user_id: userId,
      user_model: userModel
    });

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ message: 'Ошибка при получении истории транзакций' });
  }
};

// Проверить лимиты пользователя
const checkUserLimits = async (req, res) => {
  try {
    const { userId, userModel } = req.user;
    const { usageType } = req.params;

    // Получаем текущую подписку
    const subscription = await Subscription.findOne({
      user_id: userId,
      user_model: userModel,
      is_active: true
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Подписка не найдена' });
    }

    // Получаем план
    const plan = await Plan.findOne({ id: subscription.plan_id });
    if (!plan) {
      return res.status(404).json({ message: 'План не найден' });
    }

    // Получаем дневное использование
    const dailyUsage = await UsageTracking.getDailyUsage(userId, usageType);

    // Проверяем лимиты
    let limit = -1; // неограниченно
    let canAccess = true;
    let message = '';

    switch (usageType) {
      case 'project_view':
        limit = plan.limits.project_views_per_day;
        if (limit !== -1 && dailyUsage >= limit) {
          canAccess = false;
          message = `Достигнут дневной лимит просмотров проектов (${limit})`;
        }
        break;
      case 'contact_view':
        canAccess = plan.limits.startup_contacts_visible;
        if (!canAccess) {
          message = 'Просмотр контактов недоступен в вашем плане';
        }
        break;
      case 'export':
        canAccess = plan.limits.can_export;
        if (!canAccess) {
          message = 'Экспорт данных недоступен в вашем плане';
        }
        break;
      default:
        canAccess = true;
    }

    res.json({
      canAccess,
      message,
      dailyUsage,
      limit,
      subscription: {
        plan_id: subscription.plan_id,
        expires_at: subscription.expires_at,
        is_valid: subscription.is_active && subscription.expires_at > new Date()
      },
      plan: {
        name: plan.name,
        limits: plan.limits
      }
    });
  } catch (error) {
    console.error('Error checking user limits:', error);
    res.status(500).json({ message: 'Ошибка при проверке лимитов' });
  }
};

// Отследить использование
const trackUsage = async (req, res) => {
  try {
    const { userId, userModel } = req.user;
    const { usageType, count = 1, details = {} } = req.body;

    const usage = await UsageTracking.addUsage(userId, userModel, usageType, count, details);

    res.json({
      message: 'Использование отслежено',
      usage
    });
  } catch (error) {
    console.error('Error tracking usage:', error);
    res.status(500).json({ message: 'Ошибка при отслеживании использования' });
  }
};

// Инициализировать демо-планы
const initializeDemoPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: { monthly: 0, yearly: 0 },
        limits: {
          project_views_per_day: 2,
          startup_contacts_visible: false,
          can_export: false,
          can_submit_interest: true,
          access_private_deals: false
        },
        features: [
          '2 просмотра проектов в день',
          'Базовый поиск стартапов',
          'Доступ к новостям',
          'Подписка на рассылку'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        price: { monthly: 19, yearly: 190 },
        limits: {
          project_views_per_day: -1,
          startup_contacts_visible: true,
          can_export: true,
          can_submit_interest: true,
          access_private_deals: false
        },
        features: [
          'Неограниченный просмотр проектов',
          'Контакты стартапов',
          'Экспорт данных в Excel',
          'Приоритетная поддержка',
          'Расширенная аналитика',
          'Уведомления о новых проектах'
        ]
      },
      {
        id: 'partner_plus',
        name: 'Partner+',
        price: { monthly: 49, yearly: 490 },
        limits: {
          project_views_per_day: -1,
          startup_contacts_visible: true,
          can_export: true,
          can_submit_interest: true,
          access_private_deals: true
        },
        features: [
          'Все функции Pro',
          'Доступ к приватным сделкам',
          'Персональный менеджер',
          'API доступ',
          'Кастомные отчеты',
          'Приоритетное размещение',
          'Эксклюзивные мероприятия'
        ]
      }
    ];

    for (const planData of plans) {
      await Plan.findOneAndUpdate(
        { id: planData.id },
        planData,
        { upsert: true, new: true }
      );
    }

    res.json({
      message: 'Демо-планы инициализированы',
      plans: await Plan.find({ is_active: true })
    });
  } catch (error) {
    console.error('Error initializing demo plans:', error);
    res.status(500).json({ message: 'Ошибка при инициализации планов' });
  }
};

module.exports = {
  getPlans,
  getCurrentSubscription,
  createSubscription,
  cancelSubscription,
  getTransactionHistory,
  checkUserLimits,
  trackUsage,
  initializeDemoPlans
}; 