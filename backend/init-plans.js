const mongoose = require('mongoose');
const Plan = require('./src/models/Plan');
require('dotenv').config();

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const plans = [
  // Планы для инвесторов
  {
    id: 'investor_free',
    name: 'Free',
    userType: 'investor',
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
    id: 'investor_pro',
    name: 'Pro',
    userType: 'investor',
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
    id: 'investor_partner_plus',
    name: 'Partner+',
    userType: 'investor',
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
  },
  // Планы для стартапов (обновленные)
  {
    id: 'startup_free',
    name: 'Free',
    userType: 'startup',
    price: { monthly: 0, yearly: 0 },
    limits: {
      project_views_per_day: 5,
      startup_contacts_visible: false,
      can_export: false,
      can_submit_interest: true,
      access_private_deals: false
    },
    features: [
      'Базовое размещение проекта',
      'Ограниченная статистика (5 просмотров/день)',
      'Стандартная поддержка',
      '1 обновление проекта в месяц'
    ]
  },
  {
    id: 'startup_starter',
    name: 'Starter',
    userType: 'startup',
    price: { monthly: 15, yearly: 150 },
    limits: {
      project_views_per_day: 50,
      startup_contacts_visible: true,
      can_export: false,
      can_submit_interest: true,
      access_private_deals: false
    },
    features: [
      'Приоритетное размещение в топе',
      'Расширенная статистика (50 просмотров/день)',
      'Неограниченные обновления проекта',
      'Приоритетная поддержка',
      'Дополнительные материалы для презентации',
      'Уведомления о просмотрах профиля',
      'Скидка 50% для стартапов до 1 года'
    ],
    discounts: {
      startup_age_months: 12,
      discount_percent: 50
    }
  },
  {
    id: 'startup_premium',
    name: 'Premium',
    userType: 'startup',
    price: { monthly: 29, yearly: 290 },
    limits: {
      project_views_per_day: -1,
      startup_contacts_visible: true,
      can_export: true,
      can_submit_interest: true,
      access_private_deals: false
    },
    features: [
      'Все функции Starter',
      'Неограниченная статистика',
      'Экспорт данных в Excel',
      'API доступ',
      'Кастомные отчеты',
      'Интеграция с CRM',
      'Уведомления о заинтересованных инвесторах',
      'Скидка 30% для стартапов до 2 лет'
    ],
    discounts: {
      startup_age_months: 24,
      discount_percent: 30
    }
  },
  {
    id: 'startup_enterprise',
    name: 'Enterprise',
    userType: 'startup',
    price: { monthly: 99, yearly: 990 },
    limits: {
      project_views_per_day: -1,
      startup_contacts_visible: true,
      can_export: true,
      can_submit_interest: true,
      access_private_deals: true
    },
    features: [
      'Все функции Premium',
      'Персональный менеджер',
      'Эксклюзивные мероприятия',
      'Прямые контакты с инвесторами',
      'Белый лейбл',
      'Кастомные интеграции',
      'Приоритетная поддержка 24/7',
      'Аналитика конкурентов'
    ]
  }
];

async function initializePlans() {
  try {
    console.log('🔄 Инициализация планов подписок...');
    
    // Удаляем существующие планы
    await Plan.deleteMany({});
    console.log('✅ Существующие планы удалены');
    
    // Создаем новые планы
    const createdPlans = await Plan.insertMany(plans);
    console.log(`✅ Создано ${createdPlans.length} планов:`);
    
    createdPlans.forEach(plan => {
      console.log(`  - ${plan.name} (${plan.userType}): $${plan.price.monthly}/месяц`);
    });
    
    console.log('\n🎉 Планы успешно инициализированы!');
    console.log('\n📊 Статистика:');
    console.log(`  Инвесторы: ${createdPlans.filter(p => p.userType === 'investor').length} планов`);
    console.log(`  Стартапы: ${createdPlans.filter(p => p.userType === 'startup').length} планов`);
    
  } catch (error) {
    console.error('❌ Ошибка при инициализации планов:', error);
  } finally {
    mongoose.connection.close();
  }
}

initializePlans(); 