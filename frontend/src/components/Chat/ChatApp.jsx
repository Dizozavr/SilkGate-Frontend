import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import StartupSearch from './StartupSearch';

const ChatApp = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [showStartupSearch, setShowStartupSearch] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    fetchUnreadCount();
    // Обновляем счетчик каждые 30 секунд
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowStartupSearch(false);
  };

  const handleStartConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowStartupSearch(false);
  };

  const handleMessageSent = (message) => {
    // Обновляем счетчик непрочитанных после отправки сообщения
    fetchUnreadCount();
  };

  const isInvestorOrAdmin = currentUser && (currentUser.role === 'investor' || currentUser.role === 'admin');

  return (
    <div className="h-full bg-gray-50">
      <div className="max-w-7xl mx-auto h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full p-6">
          {/* Левая панель - список диалогов или поиск стартапов */}
          <div className="lg:col-span-1 h-full space-y-4">
            {/* Кнопка для инвесторов/админов */}
            {isInvestorOrAdmin && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <button
                  onClick={() => setShowStartupSearch(!showStartupSearch)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {showStartupSearch ? 'Скрыть поиск' : 'Найти стартап'}
                </button>
              </div>
            )}

            {/* Поиск стартапов */}
            {showStartupSearch && isInvestorOrAdmin && (
              <StartupSearch onStartConversation={handleStartConversation} />
            )}

            {/* Список диалогов */}
            <ChatList
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?._id}
            />
          </div>

          {/* Правая панель - окно чата */}
          <div className="lg:col-span-2 h-full">
            <ChatWindow
              conversation={selectedConversation}
              onMessageSent={handleMessageSent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp; 