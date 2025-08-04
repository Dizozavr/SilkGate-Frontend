import React from 'react';
import Icon from '../components/Shared/Icon';

export default function Products() {
  const products = [
    {
      id: 1,
      title: "Каталог стартапов",
      description: "База данных проверенных стартапов с подробной информацией о проектах, команде и финансовых показателях.",
      features: ["Фильтрация по отраслям", "Детальная аналитика", "Прямая связь с основателями"],
      icon: "database",
      category: "Для инвесторов"
    },
    {
      id: 2,
      title: "Аналитика и отчеты",
      description: "Глубокий анализ рынка, трендов и инвестиционных возможностей с регулярными обновлениями.",
      features: ["Рыночные тренды", "Инвестиционные раунды", "Прогнозы развития"],
      icon: "dashboard",
      category: "Для инвесторов"
    },
    {
      id: 3,
      title: "Платформа для питчинга",
      description: "Инструменты для создания профессиональных презентаций и проведения онлайн-питчей.",
      features: ["Шаблоны презентаций", "Онлайн-питчи", "Обратная связь"],
      icon: "presentation",
      category: "Для стартапов"
    },
    {
      id: 4,
      title: "Система управления портфелем",
      description: "Комплексное решение для управления инвестиционным портфелем и отслеживания доходности.",
      features: ["Отслеживание инвестиций", "Анализ доходности", "Управление рисками"],
      icon: "chart",
      category: "Для инвесторов"
    },
    {
      id: 5,
      title: "Маркетплейс услуг",
      description: "Площадка для поиска и заказа профессиональных услуг для развития стартапа.",
      features: ["Юридические услуги", "Маркетинг", "Разработка"],
      icon: "marketplace",
      category: "Для стартапов"
    },
    {
      id: 6,
      title: "Образовательная платформа",
      description: "Курсы, вебинары и мастер-классы от экспертов индустрии для развития навыков.",
      features: ["Онлайн-курсы", "Экспертные вебинары", "Сертификация"],
      icon: "education",
      category: "Для всех"
    }
  ];

  const categories = [
    { id: 'all', name: 'Все продукты' },
    { id: 'investors', name: 'Для инвесторов' },
    { id: 'startups', name: 'Для стартапов' },
    { id: 'all-users', name: 'Для всех' }
  ];

  return (
    <div className="min-h-screen bg-[#10182A] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
            Продукты и услуги
          </h1>
          <p className="text-lg text-muted font-light max-w-2xl leading-tight">
            Комплексные решения для инвесторов, стартапов и всех участников экосистемы инноваций.
          </p>
        </div>
        
        {/* Статистика */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Icon name="user" size={32} />
            </div>
            <h3 className="text-2xl font-light text-gray-900 mb-2">1000+</h3>
            <p className="text-gray-600 text-sm font-light leading-tight">Активных пользователей</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Icon name="award" size={32} />
            </div>
            <h3 className="text-2xl font-light text-gray-900 mb-2">50+</h3>
            <p className="text-gray-600 text-sm font-light leading-tight">Успешных сделок</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Icon name="heart" size={32} />
            </div>
            <h3 className="text-2xl font-light text-gray-900 mb-2">95%</h3>
            <p className="text-gray-600 text-sm font-light leading-tight">Довольных клиентов</p>
          </div>
        </div>
        
        {/* Продукты */}
        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name={product.icon} size={24} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-light text-gray-900 leading-tight">
                      {product.title}
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-light rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-light leading-tight mb-4">
                    {product.description}
                  </p>
                </div>
              </div>
              
              {/* Функции */}
              <div className="mb-6">
                <h4 className="text-sm font-light text-gray-700 mb-3">Основные функции:</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Icon name="check" size={16} className="text-green-500" />
                      <span className="text-sm font-light text-gray-600 leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-light">
                Узнать больше
              </button>
            </div>
          ))}
        </div>
        
        {/* Тарифы */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center mb-6">
            <Icon name="award" size={32} className="mr-4" />
            <h2 className="text-xl font-light text-gray-900">Тарифные планы</h2>
          </div>
          <p className="text-gray-600 text-sm font-light leading-tight mb-6">
            Выберите подходящий тариф для доступа к нашим продуктам и услугам.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-light text-gray-900 mb-2">Базовый</h3>
              <p className="text-3xl font-light text-gray-900 mb-4">Бесплатно</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-green-500" />
                  <span className="text-sm font-light text-gray-600">Базовый доступ к каталогу</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-green-500" />
                  <span className="text-sm font-light text-gray-600">Ограниченная аналитика</span>
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-light">
                Текущий план
              </button>
            </div>
            
            <div className="border-2 border-blue-600 rounded-lg p-6">
              <h3 className="text-lg font-light text-gray-900 mb-2">Профессиональный</h3>
              <p className="text-3xl font-light text-gray-900 mb-4">$99/мес</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-green-500" />
                  <span className="text-sm font-light text-gray-600">Полный доступ к каталогу</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-green-500" />
                  <span className="text-sm font-light text-gray-600">Расширенная аналитика</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-green-500" />
                  <span className="text-sm font-light text-gray-600">Приоритетная поддержка</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-light">
                Выбрать план
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-light text-gray-900 mb-2">Корпоративный</h3>
              <p className="text-3xl font-light text-gray-900 mb-4">$299/мес</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-green-500" />
                  <span className="text-sm font-light text-gray-600">Все функции</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-green-500" />
                  <span className="text-sm font-light text-gray-600">Персональный менеджер</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-green-500" />
                  <span className="text-sm font-light text-gray-600">API доступ</span>
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-light">
                Связаться с нами
              </button>
            </div>
          </div>
        </div>
        
        {/* Демо-информация */}
        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-light text-white mb-4">Демо-версия</h3>
          <p className="text-muted text-sm font-light leading-tight">
            Это демо-страница продуктов. В полной версии здесь будут реальные продукты с функциональностью, 
            система тарифов и интеграция с платежными системами.
          </p>
        </div>
      </div>
    </div>
  );
} 