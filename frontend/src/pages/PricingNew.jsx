import React from 'react';
import Icon from '../components/Shared/Icon';

export default function PricingNew() {
  const plans = [
    {
      id: 'basic',
      name: 'Базовый',
      price: 'Бесплатно',
      period: '',
      description: 'Для начинающих инвесторов и стартапов',
      features: [
        'Доступ к базовому каталогу стартапов',
        'Ограниченная аналитика',
        'Базовые инструменты поиска',
        'Email поддержка'
      ],
      popular: false,
      icon: 'user'
    },
    {
      id: 'professional',
      name: 'Профессиональный',
      price: '$99',
      period: '/месяц',
      description: 'Для активных участников экосистемы',
      features: [
        'Полный доступ к каталогу стартапов',
        'Расширенная аналитика и отчеты',
        'Продвинутые инструменты поиска',
        'Приоритетная поддержка',
        'Доступ к образовательным материалам',
        'Возможность размещения вакансий'
      ],
      popular: true,
      icon: 'award'
    },
    {
      id: 'enterprise',
      name: 'Корпоративный',
      price: '$299',
      period: '/месяц',
      description: 'Для крупных инвесторов и компаний',
      features: [
        'Все функции Профессионального плана',
        'Персональный менеджер',
        'API доступ для интеграций',
        'Кастомные отчеты и аналитика',
        'Приоритетное размещение в каталоге',
        'Эксклюзивные мероприятия',
        'Консультации экспертов'
      ],
      popular: false,
      icon: 'database'
    }
  ];

  const features = [
    {
      title: 'Каталог стартапов',
      basic: 'Ограниченный',
      professional: 'Полный доступ',
      enterprise: 'Полный доступ + приоритет'
    },
    {
      title: 'Аналитика и отчеты',
      basic: 'Базовые',
      professional: 'Расширенные',
      enterprise: 'Кастомные'
    },
    {
      title: 'Поддержка',
      basic: 'Email',
      professional: 'Приоритетная',
      enterprise: 'Персональный менеджер'
    },
    {
      title: 'API доступ',
      basic: 'Нет',
      professional: 'Нет',
      enterprise: 'Да'
    },
    {
      title: 'Образовательные материалы',
      basic: 'Ограниченные',
      professional: 'Полные',
      enterprise: 'Эксклюзивные'
    }
  ];

  return (
    <div className="min-h-screen bg-[#10182A] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
            Тарифные планы
          </h1>
          <p className="text-lg text-muted font-light max-w-2xl mx-auto leading-tight">
            Выберите подходящий план для доступа к нашим продуктам и услугам. 
            Все планы включают базовый функционал и масштабируются под ваши потребности.
          </p>
        </div>
        
        {/* Тарифные планы */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-sm border ${
                plan.popular 
                  ? 'border-blue-600 ring-2 ring-blue-600/20' 
                  : 'border-gray-200'
              } p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-light">
                    Популярный
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name={plan.icon} size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm font-light leading-tight mb-4">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-light text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 text-sm font-light">{plan.period}</span>
                  )}
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Icon name="check" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-light text-gray-600 leading-tight">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full py-3 px-6 rounded-lg font-light transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan.id === 'basic' ? 'Начать бесплатно' : 'Выбрать план'}
              </button>
            </div>
          ))}
        </div>
        
        {/* Сравнение функций */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-xl font-light text-gray-900 mb-8 text-center">
            Сравнение функций
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-light text-gray-900">Функция</th>
                  <th className="text-center py-4 px-4 font-light text-gray-900">Базовый</th>
                  <th className="text-center py-4 px-4 font-light text-gray-900">Профессиональный</th>
                  <th className="text-center py-4 px-4 font-light text-gray-900">Корпоративный</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 font-light text-gray-900">{feature.title}</td>
                    <td className="py-4 px-4 text-center font-light text-gray-600">{feature.basic}</td>
                    <td className="py-4 px-4 text-center font-light text-gray-600">{feature.professional}</td>
                    <td className="py-4 px-4 text-center font-light text-gray-600">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-xl font-light text-gray-900 mb-8">Часто задаваемые вопросы</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-light text-gray-900 mb-2">
                Можно ли изменить план в любое время?
              </h3>
              <p className="text-gray-600 text-sm font-light leading-tight">
                Да, вы можете изменить план в любое время. При переходе на более дорогой план 
                оплата будет пропорционально распределена, при переходе на более дешевый - 
                остаток средств будет зачислен на следующий период.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-900 mb-2">
                Есть ли пробный период?
              </h3>
              <p className="text-gray-600 text-sm font-light leading-tight">
                Да, мы предоставляем 14-дневный пробный период для всех платных планов. 
                Вы можете протестировать все функции без обязательств.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-900 mb-2">
                Какие способы оплаты принимаются?
              </h3>
              <p className="text-gray-600 text-sm font-light leading-tight">
                Мы принимаем все основные кредитные карты, банковские переводы и электронные платежи. 
                Для корпоративных клиентов доступны специальные условия оплаты.
              </p>
            </div>
          </div>
        </div>
        
        {/* Демо-информация */}
        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-light text-white mb-4">Демо-версия</h3>
          <p className="text-muted text-sm font-light leading-tight">
            Это демо-страница тарифов. В полной версии здесь будет система оплаты, 
            управление подписками и интеграция с платежными системами.
          </p>
        </div>
      </div>
    </div>
  );
} 