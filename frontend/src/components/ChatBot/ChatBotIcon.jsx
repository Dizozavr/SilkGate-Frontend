import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const ChatBotIcon = ({ onOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Показываем иконку через 3 секунды после загрузки страницы
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Получаем информацию о пользователе
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    onOpen();
    setHasUnread(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        className="relative bg-white hover:bg-gray-50 text-[#3B82F6] rounded-full p-4 shadow-lg border border-gray-200 transition-all duration-300 transform hover:scale-110"
        title="Чат поддержки"
      >
        {/* Иконка чата */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>

        {/* Индикатор непрочитанных сообщений */}
        {hasUnread && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            !
          </span>
        )}

        {/* Анимация пульсации */}
        <div className="absolute inset-0 bg-[#3B82F6] rounded-full animate-ping opacity-20"></div>
      </button>

      {/* Подсказка */}
      <div className="absolute bottom-full right-0 mb-2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Онлайн поддержка</span>
        </div>
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
      </div>
    </div>
  );
};

export default ChatBotIcon; 