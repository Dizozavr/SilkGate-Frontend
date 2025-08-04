import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import StartupSearch from './StartupSearch';

const ChatApp = ({ otherUserId, otherUserModel, otherUserName }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [showStartupSearch, setShowStartupSearch] = useState(false);

  useEffect(() => {
    // Получаем токен в зависимости от роли пользователя
    const investorToken = localStorage.getItem('investorToken');
    const startupToken = localStorage.getItem('startupToken');
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');
    
    const token = investorToken || startupToken || adminToken || userToken;
    
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

  // Если передан otherUserId, создаем или получаем чат с этим пользователем
  useEffect(() => {
    if (otherUserId && otherUserModel && currentUser) {
      createOrGetConversation();
    }
  }, [otherUserId, otherUserModel, currentUser]);

  const createOrGetConversation = async () => {
    try {
      // Получаем токен в зависимости от роли пользователя
      const investorToken = localStorage.getItem('investorToken');
      const startupToken = localStorage.getItem('startupToken');
      const adminToken = localStorage.getItem('adminToken');
      const userToken = localStorage.getItem('userToken');
      
      const token = investorToken || startupToken || adminToken || userToken;
      
      console.log('ChatApp - Creating conversation:', {
        otherUserId,
        otherUserModel,
        hasToken: !!token,
        investorToken: !!investorToken,
        startupToken: !!startupToken,
        adminToken: !!adminToken,
        userToken: !!userToken
      });
      
      if (!token) {
        console.error('ChatApp - No token found');
        return;
      }
      
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          other_user_id: otherUserId,
          other_user_model: otherUserModel
        })
      });

      console.log('ChatApp - Response status:', response.status);
      
      if (response.ok) {
        const conversation = await response.json();
        console.log('ChatApp - Conversation created:', conversation);
        setSelectedConversation(conversation);
      } else {
        const errorText = await response.text();
        console.error('ChatApp - Error response:', errorText);
        
        // Если ошибка с пользователем, создаем демо-чат
        if (errorText.includes('Пользователь не найден')) {
          console.log('ChatApp - Creating demo conversation');
          const demoConversation = {
            _id: 'demo-' + Date.now(),
            other_participant: {
              username: otherUserName || 'Демо пользователь',
              _id: otherUserId
            },
            isDemo: true
          };
          setSelectedConversation(demoConversation);
        }
      }
    } catch (error) {
      console.error('Error creating/getting conversation:', error);
      
      // В случае ошибки создаем демо-чат
      console.log('ChatApp - Creating demo conversation due to error');
      const demoConversation = {
        _id: 'demo-' + Date.now(),
        other_participant: {
          username: otherUserName || 'Демо пользователь',
          _id: otherUserId
        },
        isDemo: true
      };
      setSelectedConversation(demoConversation);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      // Получаем токен в зависимости от роли пользователя
      const investorToken = localStorage.getItem('investorToken');
      const startupToken = localStorage.getItem('startupToken');
      const adminToken = localStorage.getItem('adminToken');
      const userToken = localStorage.getItem('userToken');
      
      const token = investorToken || startupToken || adminToken || userToken;
      
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
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {otherUserId ? (
          // Если передан otherUserId, показываем только окно чата
          <div className="flex-1 flex flex-col">
            <ChatWindow
              conversation={selectedConversation}
              onMessageSent={handleMessageSent}
            />
          </div>
        ) : (
          // Иначе показываем полный интерфейс с списком чатов
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
        )}
      </div>
    </div>
  );
};

export default ChatApp; 