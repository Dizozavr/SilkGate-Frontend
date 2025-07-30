import React, { useState, useEffect } from 'react';
import PaymentForm from '../components/PaymentForm';

const PricingNew = () => {
  const [userType, setUserType] = useState('investor');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [period, setPeriod] = useState('monthly');

  // Статические планы для инвесторов
  const getStaticInvestorPlans = () => [
    {
      id: 'investor_free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: [
        '2 просмотра проектов в день',
        'Базовый поиск стартапов',
        'Доступ к новостям',
        'Подписка на рассылку'
      ],
      buttonVariant: 'secondary',
      popular: false
    },
    {
      id: 'investor_pro',
      name: 'Pro',
      price: { monthly: 19, yearly: 190 },
      features: [
        'Неограниченный просмотр проектов',
        'Контакты стартапов',
        'Экспорт данных в Excel',
        'Приоритетная поддержка',
        'Расширенная аналитика',
        'Уведомления о новых проектах'
      ],
      buttonVariant: 'primary',
      popular: true
    },
    {
      id: 'investor_partner_plus',
      name: 'Partner+',
      price: { monthly: 49, yearly: 490 },
      features: [
        'Все функции Pro',
        'Доступ к приватным сделкам',
        'Персональный менеджер',
        'API доступ',
        'Кастомные отчеты',
        'Приоритетное размещение',
        'Эксклюзивные мероприятия'
      ],
      buttonVariant: 'premium',
      popular: false
    }
  ];

  // Статические планы для стартапов
  const getStaticStartupPlans = () => [
    {
      id: 'startup_free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: [
        'Базовое размещение проекта',
        'Ограниченная статистика (5 просмотров/день)',
        'Стандартная поддержка',
        '1 обновление проекта в месяц'
      ],
      buttonVariant: 'secondary',
      popular: false
    },
    {
      id: 'startup_starter',
      name: 'Starter',
      price: { monthly: 15, yearly: 150 },
      features: [
        'Приоритетное размещение в топе',
        'Расширенная статистика (50 просмотров/день)',
        'Неограниченные обновления проекта',
        'Приоритетная поддержка',
        'Дополнительные материалы для презентации',
        'Уведомления о просмотрах профиля',
        'Скидка 50% для стартапов до 1 года'
      ],
      buttonVariant: 'primary',
      popular: true,
      discounts: {
        startup_age_months: 12,
        discount_percent: 50
      }
    },
    {
      id: 'startup_premium',
      name: 'Premium',
      price: { monthly: 29, yearly: 290 },
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
      buttonVariant: 'premium',
      popular: false,
      discounts: {
        startup_age_months: 24,
        discount_percent: 30
      }
    },
    {
      id: 'startup_enterprise',
      name: 'Enterprise',
      price: { monthly: 99, yearly: 990 },
      features: [
        'Все функции Premium',
        'Персональный менеджер',
        'Эксклюзивные мероприятия',
        'Прямые контакты с инвесторами',
        'Белый лейбл',
        'Кастомные интеграции',
        'Приоритетная поддержка 24/7',
        'Аналитика конкурентов'
      ],
      buttonVariant: 'premium',
      popular: false
    }
  ];

  // Определяем тип пользователя
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.role === 'startup') {
          setUserType('startup');
        } else if (decoded.role === 'investor') {
          setUserType('investor');
        }
      } catch (error) {
        console.log('Не удалось определить тип пользователя');
      }
    }
  }, []);

  // Загружаем планы с сервера
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`/api/subscriptions/plans?userType=${userType}`);
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
        } else {
          // Используем статические планы если API недоступен
          setPlans(userType === 'startup' ? getStaticStartupPlans() : getStaticInvestorPlans());
        }
      } catch (error) {
        console.log('Используем статические планы');
        setPlans(userType === 'startup' ? getStaticStartupPlans() : getStaticInvestorPlans());
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [userType]);

  const getPrice = (plan) => {
    const price = period === 'monthly' ? plan.price.monthly : plan.price.yearly;
    return price === 0 ? 'Бесплатно' : `$${price}`;
  };

  const getPeriod = () => {
    return period === 'monthly' ? 'месяц' : 'год';
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setSelectedPlan(null);
    // Здесь можно добавить редирект или уведомление
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setSelectedPlan(null);
  };

  const getDiscountedPrice = (plan) => {
    if (!plan.discounts || !plan.discounts.discount_percent) {
      return getPrice(plan);
    }
    
    const originalPrice = period === 'monthly' ? plan.price.monthly : plan.price.yearly;
    const discountedPrice = originalPrice * (1 - plan.discounts.discount_percent / 100);
    
    return `$${Math.round(discountedPrice)}`;
  };

  const getDiscountBadge = (plan) => {
    if (!plan.discounts || !plan.discounts.discount_percent) {
      return null;
    }
    
    return (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          -{plan.discounts.discount_percent}%
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10182A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Загружаем планы...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10182A] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Выберите подходящий план
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Начните бесплатно и масштабируйтесь по мере роста вашего бизнеса
          </p>
        </div>

        {/* Переключатель типа пользователя */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-700">
            <button
              onClick={() => setUserType('investor')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                userType === 'investor'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Для инвесторов
            </button>
            <button
              onClick={() => setUserType('startup')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                userType === 'startup'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Для стартапов
            </button>
          </div>
        </div>

        {/* Переключатель периода */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-700">
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                period === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Ежемесячно
            </button>
            <button
              onClick={() => setPeriod('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                period === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Ежегодно
              <span className="ml-1 text-xs bg-green-600 text-white px-2 py-1 rounded">
                Экономия
              </span>
            </button>
          </div>
        </div>

        {/* Карточки планов */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'border-blue-500 scale-105' : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {getDiscountBadge(plan)}
              
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Популярный
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {getDiscountedPrice(plan)}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-gray-500 ml-2">/{getPeriod()}</span>
                    )}
                  </div>
                  {plan.discounts && plan.discounts.discount_percent > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      <span className="line-through">
                        ${period === 'monthly' ? plan.price.monthly : plan.price.yearly}
                      </span>
                      <span className="ml-2 text-green-600 font-medium">
                        Экономия {plan.discounts.discount_percent}%
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    plan.buttonVariant === 'secondary'
                      ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      : plan.buttonVariant === 'premium'
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.price.monthly === 0 ? 'Начать бесплатно' : 'Выбрать план'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Дополнительная информация */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Вопросы по тарифам?
          </h2>
          <p className="text-gray-300 mb-6">
            Наша команда готова помочь выбрать оптимальный план для вашего бизнеса
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Связаться с нами
          </button>
        </div>
      </div>

      {/* Модальное окно оплаты */}
      {showPaymentForm && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <PaymentForm
              plan={selectedPlan}
              period={period}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingNew; 