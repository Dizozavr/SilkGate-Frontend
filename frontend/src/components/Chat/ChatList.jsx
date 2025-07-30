import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const ChatList = ({ onSelectConversation, selectedConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

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
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        setError('Ошибка при загрузке диалогов');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Ошибка при загрузке диалогов');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 48) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const isInvestorOrAdmin = currentUser && (currentUser.role === 'investor' || currentUser.role === 'admin');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        {isInvestorOrAdmin ? (
          <>
            <p>У вас пока нет диалогов</p>
            <p className="text-sm mt-2">Начните общение со стартапами</p>
          </>
        ) : (
          <>
            <p>У вас пока нет сообщений</p>
            <p className="text-sm mt-2">Инвесторы могут написать вам первыми</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {isInvestorOrAdmin ? 'Диалоги со стартапами' : 'Сообщения от инвесторов'}
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {conversations.map((conversation) => (
          <div
            key={conversation._id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedConversationId === conversation._id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {conversation.other_participant?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.other_participant?.username || 'Неизвестный пользователь'}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {conversation.unread_count > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unread_count}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.last_message?.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.last_message?.content ? 
                      truncateText(conversation.last_message.content) : 
                      'Нет сообщений'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList; 