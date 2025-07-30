import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

const ChatWindow = ({ conversation, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (conversation) {
      fetchMessages();
      setCurrentUser(getCurrentUser());
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentUser = () => {
    try {
      const token = localStorage.getItem('token');
      return token ? jwtDecode(token) : null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const fetchMessages = async () => {
    if (!conversation) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/chat/conversations/${conversation._id}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      } else {
        setError('Ошибка при загрузке сообщений');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Ошибка при загрузке сообщений');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          conversation_id: conversation._id,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
        if (onMessageSent) {
          onMessageSent(sentMessage);
        }
      } else {
        setError('Ошибка при отправке сообщения');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Ошибка при отправке сообщения');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isOwnMessage = (message) => {
    return currentUser && message.sender.user_id === currentUser.userId;
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center text-gray-500">
          <p>Выберите диалог для начала общения</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Заголовок чата */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {conversation.other_participant?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {conversation.other_participant?.username || 'Неизвестный пользователь'}
            </h3>
            <p className="text-sm text-gray-500">Онлайн</p>
          </div>
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Начните общение первым!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwnMessage(message)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className={`text-xs ${
                    isOwnMessage(message) ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.created_at)}
                  </span>
                </div>
                {message.is_read && isOwnMessage(message) && (
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-blue-100">✓</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Форма отправки сообщения */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Отправить'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow; 