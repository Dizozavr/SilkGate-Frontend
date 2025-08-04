import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'message',
      title: 'Новое сообщение',
      content: 'Алексей отправил вам сообщение о проекте',
      time: '2 мин назад',
      isRead: false,
      color: 'blue'
    },
    {
      id: 2,
      type: 'investment',
      title: 'Инвестиционная возможность',
      content: 'Новый стартап в сфере AI ищет инвесторов',
      time: '15 мин назад',
      isRead: false,
      color: 'green'
    },
    {
      id: 3,
      type: 'update',
      title: 'Обновление системы',
      content: 'Добавлены новые функции аналитики',
      time: '1 час назад',
      isRead: true,
      color: 'purple'
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Напоминание',
      content: 'Не забудьте проверить новые проекты',
      time: '2 часа назад',
      isRead: true,
      color: 'orange'
    }
  ]);

  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const getNotificationColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500'
    };
    return colors[color] || 'bg-gray-500';
  };

  const getTypeLabel = (type) => {
    const labels = {
      message: 'Сообщение',
      investment: 'Инвестиции',
      update: 'Обновление',
      reminder: 'Напоминание'
    };
    return labels[type] || 'Уведомление';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Кнопка уведомлений */}
      <button
        onClick={toggleNotifications}
        className="relative p-1 text-white hover:text-[#FFD700] transition-colors"
        title="Уведомления"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5v-5zM10 19H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-5" />
        </svg>
        
        {/* Индикатор непрочитанных уведомлений */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Выпадающее меню уведомлений */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1a2238] border border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Уведомления</h3>
              <Link 
                to="/notifications" 
                className="text-[#FFD700] text-xs hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Все уведомления
              </Link>
            </div>
          </div>
          
          <div className="py-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-700 transition-colors cursor-pointer ${
                    !notification.isRead ? 'bg-gray-700/50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getNotificationColor(notification.color)}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-white text-sm font-medium truncate">
                          {notification.title}
                        </p>
                        <span className="text-gray-400 text-xs">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs mt-1 line-clamp-2">
                        {notification.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[#FFD700] text-xs">
                          {getTypeLabel(notification.type)}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-400 text-sm">Нет новых уведомлений</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-600">
            <Link 
              to="/notifications"
              className="block w-full text-center text-[#FFD700] text-sm hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Посмотреть все уведомления
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter; 