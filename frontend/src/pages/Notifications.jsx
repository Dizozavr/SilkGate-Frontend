import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showRead, setShowRead] = useState(true);

  // Демо-данные уведомлений (расширенный список)
  const demoNotifications = [
    {
      id: 1,
      type: 'startup',
      title: 'Новый стартап "ЭкоТех"',
      message: 'Зарегистрировался на платформе. Рекомендуем обратить внимание на их экологический проект!',
      time: '2 минуты назад',
      isRead: false,
      icon: '🌱',
      color: 'green',
      link: '/chat-demo'
    },
    {
      id: 2,
      type: 'analytics',
      title: 'Рост портфеля',
      message: 'Ваш инвестиционный портфель вырос на 15% за месяц. Отличные результаты!',
      time: '1 час назад',
      isRead: false,
      icon: '📈',
      color: 'blue',
      link: '/investor-dashboard'
    },
    {
      id: 3,
      type: 'message',
      title: 'Новое сообщение',
      message: 'Стартап "AI Assistant" отправил вам сообщение с обновленной презентацией проекта.',
      time: '3 часа назад',
      isRead: true,
      icon: '💬',
      color: 'purple',
      link: '/chat-demo'
    },
    {
      id: 4,
      type: 'deal',
      title: 'Статус сделки обновлен',
      message: 'Сделка с "FinTech Pro" перешла на этап подписания договора. Требуется ваше подтверждение.',
      time: '1 день назад',
      isRead: true,
      icon: '💰',
      color: 'yellow',
      link: '/investor-dashboard'
    },
    {
      id: 5,
      type: 'recommendation',
      title: 'Персональная рекомендация',
      message: 'Проект "HealthTech" соответствует вашим инвестиционным критериям. Рекомендуем рассмотреть.',
      time: '2 дня назад',
      isRead: true,
      icon: '🎯',
      color: 'red',
      link: '/investor-dashboard'
    },
    {
      id: 6,
      type: 'startup',
      title: 'Обновление проекта "SmartHome"',
      message: 'Стартап обновил информацию о своем проекте. Добавлены новые метрики и достижения.',
      time: '3 дня назад',
      isRead: true,
      icon: '🏠',
      color: 'green',
      link: '/investor-dashboard'
    },
    {
      id: 7,
      type: 'analytics',
      title: 'Еженедельный отчет',
      message: 'Ваш портфель показал стабильный рост. Новые возможности для инвестиций.',
      time: '1 неделя назад',
      isRead: true,
      icon: '📊',
      color: 'blue',
      link: '/investor-dashboard'
    },
    {
      id: 8,
      type: 'deal',
      title: 'Новая сделка',
      message: 'Стартап "EduTech" предложил новую сделку. Сумма инвестиций: $50,000.',
      time: '1 неделя назад',
      isRead: true,
      icon: '🎓',
      color: 'yellow',
      link: '/investor-dashboard'
    }
  ];

  useEffect(() => {
    setNotifications(demoNotifications);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return showRead || !notification.isRead;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter && (showRead || !notification.isRead);
  });

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationColor = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      red: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[color] || colors.blue;
  };

  const getTypeLabel = (type) => {
    const labels = {
      startup: 'Стартап',
      analytics: 'Аналитика',
      message: 'Сообщение',
      deal: 'Сделка',
      recommendation: 'Рекомендация'
    };
    return labels[type] || type;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo-icon-new.png" alt="SilkGate" className="w-8 h-8" />
                <span className="text-[#FFD700] font-bold text-xl">SilkGate</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Уведомления</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
                Демо режим
              </span>
              <Link
                to="/investor-dashboard"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                ← Назад к дашборду
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Фильтры и настройки */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">Фильтры</h2>
              
              {/* Фильтр по типу */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Все уведомления</option>
                <option value="unread">Непрочитанные</option>
                <option value="startup">Стартапы</option>
                <option value="analytics">Аналитика</option>
                <option value="message">Сообщения</option>
                <option value="deal">Сделки</option>
                <option value="recommendation">Рекомендации</option>
              </select>

              {/* Показать прочитанные */}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showRead}
                  onChange={(e) => setShowRead(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Показать прочитанные</span>
              </label>
            </div>

            {/* Статистика и действия */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{filteredNotifications.length}</span> из {notifications.length} уведомлений
                {unreadCount > 0 && (
                  <span className="ml-2 text-blue-600">
                    ({unreadCount} непрочитанных)
                  </span>
                )}
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Отметить все как прочитанные
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Список уведомлений */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md ${
                  !notification.isRead ? 'ring-2 ring-blue-200 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Иконка */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getNotificationColor(notification.color)}`}>
                    {notification.icon}
                  </div>
                  
                  {/* Содержимое */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              Новое
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-3">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            {notification.time}
                          </span>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getNotificationColor(notification.color)}`}>
                              {getTypeLabel(notification.type)}
                            </span>
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Отметить как прочитанное
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75l2.25 2.25V12a8.25 8.25 0 0 0-16.5 0v3.75L4.5 15.75V9.75a6 6 0 0 1 6-6z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Нет уведомлений</h3>
              <p className="text-gray-500 mb-4">
                {filter === 'all' 
                  ? 'У вас пока нет уведомлений' 
                  : `Нет уведомлений по фильтру "${getTypeLabel(filter)}"`
                }
              </p>
              <button
                onClick={() => {
                  setFilter('all');
                  setShowRead(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Показать все уведомления
              </button>
            </div>
          )}
        </div>

        {/* Информация о демо-режиме */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-1">Демо-режим</h4>
              <p className="text-sm text-yellow-700">
                Это демо-версия системы уведомлений. В реальном режиме уведомления будут приходить автоматически 
                при важных событиях на платформе и сохраняться в базе данных.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 