import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [userType, setUserType] = useState('investor');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Определяем тип пользователя
  useEffect(() => {
    const investorToken = localStorage.getItem('investorToken');
    const startupToken = localStorage.getItem('startupToken');
    
    if (startupToken) {
      setUserType('startup');
    } else if (investorToken) {
      setUserType('investor');
    } else {
      setUserType('investor'); // По умолчанию показываем планы для инвесторов
    }
  }, []);

  // Загружаем планы с сервера
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/subscriptions/plans');
        if (response.ok) {
          const allPlans = await response.json();
          // Фильтруем планы по типу пользователя
          const filteredPlans = allPlans.filter(plan => plan.userType === userType);
          setPlans(filteredPlans);
        } else {
          // Fallback на статические планы
          setPlans(getStaticPlans(userType));
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        // Fallback на статические планы
        setPlans(getStaticPlans(userType));
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [userType]);

  const getStaticPlans = (type) => {
    if (type === 'startup') {
      return [
        {
          id: 'startup_free',
          name: 'Free',
          userType: 'startup',
          price: { monthly: 0, yearly: 0 },
          description: 'Базовое размещение проекта',
          features: [
            'Базовое размещение проекта',
            'Ограниченная статистика (5 просмотров/день)',
            'Стандартная поддержка',
            '1 обновление проекта в месяц'
          ],
          buttonText: 'Начать бесплатно',
          buttonVariant: 'outline',
          popular: false
        },
        {
          id: 'startup_premium',
          name: 'Premium',
          userType: 'startup',
          price: { monthly: 29, yearly: 290 },
          description: 'Расширенные возможности для стартапов',
          features: [
            'Приоритетное размещение в топе',
            'Расширенная аналитика',
            'Неограниченные обновления',
            'Приоритетная поддержка',
            'Дополнительные материалы',
            'Уведомления о новых инвесторах',
            'API доступ'
          ],
          buttonText: 'Выбрать Premium',
          buttonVariant: 'primary',
          popular: true
        },
        {
          id: 'startup_enterprise',
          name: 'Enterprise',
          userType: 'startup',
          price: { monthly: 99, yearly: 990 },
          description: 'Премиум функции для корпораций',
          features: [
            'Все функции Premium',
            'Персональный менеджер',
            'Кастомные отчеты',
            'Интеграция с CRM',
            'Эксклюзивные мероприятия',
            'Прямые контакты с инвесторами',
            'Белый лейбл'
          ],
          buttonText: 'Выбрать Enterprise',
          buttonVariant: 'premium',
          popular: false
        } else {
      return [
        {
          id: 'investor_free',
          name: 'Free',
          userType: 'investor',
          price: { monthly: 0, yearly: 0 },
          description: 'Базовый доступ к платформе',
          features: [
            '2 просмотра проектов в день',
            'Базовый поиск стартапов',
            'Доступ к новостям',
            'Подписка на рассылку'
          ],
          buttonText: 'Начать бесплатно',
          buttonVariant: 'outline',
          popular: false
        },
        {
          id: 'investor_pro',
          name: 'Pro',
          userType: 'investor',
          price: { monthly: 19, yearly: 190 },
          description: 'Расширенные возможности для инвесторов',
          features: [
            'Неограниченный просмотр проектов',
            'Контакты стартапов',
            'Экспорт данных в Excel',
            'Приоритетная поддержка',
            'Расширенная аналитика',
            'Уведомления о новых проектах'
          ],
          buttonText: 'Выбрать Pro',
          buttonVariant: 'primary',
          popular: true
        },
        {
          id: 'investor_partner_plus',
          name: 'Partner+',
          userType: 'investor',
          price: { monthly: 49, yearly: 490 },
          description: 'Премиум функции для партнеров',
          features: [
            'Все функции Pro',
            'Доступ к приватным сделкам',
            'Персональный менеджер',
            'API доступ',
            'Кастомные отчеты',
            'Приоритетное размещение',
            'Эксклюзивные мероприятия'
          ],
          buttonText: 'Выбрать Partner+',
          buttonVariant: 'premium',
          popular: false
        }
      ];
    }
  };

  const getPrice = (plan) => {
    const price = isYearly ? plan.price.yearly : plan.price.monthly;
    return price === 0 ? 'Бесплатно' : `$${price}`;
  };

  const getPeriod = () => isYearly ? '/год' : '/месяц';

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setSelectedPlan(null);
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-[#10182A] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
            Выберите свой план
          </h1>
          <p className="text-xl text-gray-300 font-['Inter'] max-w-2xl mx-auto mb-8">
            Начните с бесплатного плана и масштабируйтесь по мере роста ваших потребностей
          </p>
          
          {/* Переключатель типа пользователя */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setUserType('investor')}
                className={`px-6 py-2 rounded-md font-['Inter'] font-medium transition-all ${
                  userType === 'investor'
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Для инвесторов
              </button>
              <button
                onClick={() => setUserType('startup')}
                className={`px-6 py-2 rounded-md font-['Inter'] font-medium transition-all ${
                  userType === 'startup'
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Для стартапов
              </button>
            </div>
          </div>
        </div>

        {/* Переключатель периодов */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 rounded-lg p-1 flex items-center">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-md font-['Inter'] font-medium transition-all ${
                !isYearly
                  ? 'bg-[#FFD700] text-[#10182A]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Ежемесячно
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-md font-['Inter'] font-medium transition-all ${
                isYearly
                  ? 'bg-[#FFD700] text-[#10182A]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Ежегодно
              <span className="ml-2 text-sm text-[#FFD700]">-17%</span>
            </button>
          </div>
        </div>

        {/* Тарифные планы */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-8 shadow-xl transition-all hover:shadow-2xl ${
                plan.popular ? 'ring-2 ring-[#FFD700] scale-105' : ''
              }`}
            >
              {/* Популярный бейдж */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#FFD700] text-[#10182A] px-4 py-1 rounded-full text-sm font-['Inter'] font-semibold">
                    Популярный
                  </span>
                </div>
              )}

              {/* Заголовок плана */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-['Playfair_Display'] font-bold text-[#10182A] mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 font-['Inter'] text-sm">
                  {plan.description}
                </p>
              </div>

              {/* Цена */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-['Playfair_Display'] font-bold text-[#10182A]">
                    {getPrice(plan)}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-gray-500 font-['Inter'] ml-1">
                      {getPeriod()}
                    </span>
                  )}
                </div>
                {isYearly && plan.price.monthly > 0 && (
                  <p className="text-sm text-gray-500 font-['Inter'] mt-2">
                    Экономия ${(plan.price.monthly * 12 - plan.price.yearly)} в год
                  </p>
                )}
              </div>

              {/* Функции */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-[#3B82F6] mt-0.5 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700 font-['Inter'] text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Кнопка */}
              <button
                onClick={() => handlePlanSelect(plan)}
                className={`w-full py-3 px-6 rounded-lg font-['Inter'] font-semibold transition-all ${
                  plan.buttonVariant === 'outline'
                    ? 'border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white'
                    : plan.buttonVariant === 'premium'
                    ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#10182A] hover:from-[#FFA500] hover:to-[#FFD700]'
                    : 'bg-[#3B82F6] text-white hover:bg-[#2563EB]'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ секция */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-8">
            Часто задаваемые вопросы
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-lg p-6 text-left">
              <h3 className="font-['Playfair_Display'] font-semibold text-white mb-3">
                Можно ли отменить подписку?
              </h3>
              <p className="text-gray-300 font-['Inter'] text-sm">
                Да, вы можете отменить подписку в любое время. Доступ сохранится до конца оплаченного периода.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-6 text-left">
              <h3 className="font-['Playfair_Display'] font-semibold text-white mb-3">
                Есть ли пробный период?
              </h3>
              <p className="text-gray-300 font-['Inter'] text-sm">
                Да, все платные планы имеют 7-дневный пробный период без обязательств.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-6 text-left">
              <h3 className="font-['Playfair_Display'] font-semibold text-white mb-3">
                Как изменить план?
              </h3>
              <p className="text-gray-300 font-['Inter'] text-sm">
                Вы можете изменить план в любое время в настройках профиля. Изменения вступят в силу немедленно.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-6 text-left">
              <h3 className="font-['Playfair_Display'] font-semibold text-white mb-3">
                Какие способы оплаты?
              </h3>
              <p className="text-gray-300 font-['Inter'] text-sm">
                Мы принимаем все основные кредитные карты, PayPal и банковские переводы.
              </p>
            </div>
          </div>
        </div>

        {/* CTA секция */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] rounded-2xl p-12">
            <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-4">
              Готовы начать?
            </h2>
            <p className="text-xl text-blue-100 font-['Inter'] mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам инвесторов, которые уже нашли свои лучшие сделки на SilkGate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-[#FFD700] text-[#10182A] px-8 py-3 rounded-lg font-['Inter'] font-semibold hover:bg-[#FFA500] transition-all"
              >
                Создать аккаунт
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-['Inter'] font-semibold hover:bg-white hover:text-[#10182A] transition-all"
              >
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно оплаты */}
      {showPaymentForm && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <PaymentForm
              plan={selectedPlan}
              period={isYearly ? 'yearly' : 'monthly'}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing; 