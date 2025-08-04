import React, { useState, useEffect, useRef } from 'react';

// Добавляем CSS анимации
const chatStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .message-bubble {
    transition: all 0.2s ease-in-out;
  }
  
  .message-bubble:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

// Вставляем стили в head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = chatStyles;
  document.head.appendChild(styleElement);
}

const ChatWindow = ({ conversation, onMessageSent, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);


  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages || []);
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    const message = {
      _id: Date.now().toString(),
      content: newMessage.trim(),
      sender: { user_id: 'current-user' },
      created_at: new Date().toISOString(),
      isVerified: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    if (onMessageSent) {
      onMessageSent(message);
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
    return message.sender.user_id === 'current-user';
  };



  if (!conversation) {
    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Заголовок чата */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-sm">T</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Тестовый чат</h3>
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Создание чата...
                </p>
              </div>
            </div>
            

          </div>
        </div>

        {/* Область сообщений */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="text-center text-gray-500 mt-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-lg font-medium">Создание чата...</p>
            <p className="text-sm mt-2 text-gray-400">Попробуйте отправить сообщение ниже</p>
          </div>
        </div>

        {/* Форма отправки сообщения */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={sendMessage} className="flex space-x-3">
            <div className="flex-1 relative">
                          <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent bg-white text-gray-900 transition-colors"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
              Демо
            </div>
          </div>
                      <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-3 bg-[#3B82F6] text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-light"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Заголовок чата */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center">
              <span className="text-white font-light text-sm">
                {conversation.other_participant?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-light text-gray-900">
                {conversation.other_participant?.username || 'Неизвестный пользователь'}
                {conversation.isDemo && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Демо
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                {conversation.isDemo ? 'Демо режим' : 'Онлайн'}
              </p>
            </div>
          </div>
          

        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Начните общение первым!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message._id}
              className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'} animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage(message) ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Аватар */}
                {!isOwnMessage(message) && (
                  <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-light">
                      {message.sender.user_id === 'system' ? 'S' : (conversation.other_participant?.username?.charAt(0).toUpperCase() || 'U')}
                    </span>
                  </div>
                )}
                
                {/* Сообщение */}
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm message-bubble ${
                    message.sender.user_id === 'system'
                      ? 'bg-[#3B82F6] text-white rounded-bl-md'
                      : isOwnMessage(message)
                      ? 'bg-[#3B82F6] text-white rounded-br-md'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  <div className="flex flex-col">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {/* Индикатор верификации */}
                    {message.isVerified !== undefined && message.sender.user_id !== 'system' && (
                      <div className="flex items-center mt-2">
                        {message.isVerified ? (
                          <span className={`text-xs flex items-center font-light ${
                            isOwnMessage(message) ? 'text-blue-100' : 'text-[#3B82F6]'
                          }`}>
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Подпись проверена
                          </span>
                        ) : (
                          <span className={`text-xs flex items-center font-light ${
                            isOwnMessage(message) ? 'text-red-200' : 'text-red-600'
                          }`}>
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Подпись не проверена
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Специальный индикатор для системных сообщений */}
                    {message.sender.user_id === 'system' && (
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-blue-200 flex items-center font-light">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          Системное сообщение
                        </span>
                      </div>
                    )}
                    
                    {/* Время и статус */}
                    <div className={`flex items-center justify-between mt-1 ${
                      isOwnMessage(message) ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      <span className="text-xs font-light">{formatTime(message.created_at)}</span>
                      {message.is_read && isOwnMessage(message) && (
                        <div className="flex items-center ml-2">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Аватар для своих сообщений */}
                {isOwnMessage(message) && (
                  <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-light">
                      Я
                    </span>
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
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-gray-900 bg-white"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-light transition-colors"
          >
            Отправить
          </button>
        </form>
      </div>


    </div>
  );
};

export default ChatWindow; 