import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getBotResponse, shouldTransferToAdmin, getWelcomeMessage } from './ChatBotService';

const ChatBotModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
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

    // Добавляем приветственное сообщение при открытии
    if (isOpen && messages.length === 0) {
      const userRole = currentUser?.role || 'user';
      const welcomeMessage = getWelcomeMessage(userRole);
      
      setTimeout(() => {
        addMessage('bot', welcomeMessage);
      }, 500);
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    // Прокрутка к последнему сообщению
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (sender, text, isTransfer = false) => {
    const newMessage = {
      id: Date.now(),
      sender,
      text,
      timestamp: new Date(),
      isTransfer
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    const userRole = currentUser?.role || 'user';

    // Добавляем сообщение пользователя
    addMessage('user', userMessage);
    setInputMessage('');

    // Показываем индикатор печати
    setIsTyping(true);

    // Имитируем задержку ответа бота
    setTimeout(async () => {
      setIsTyping(false);

      // Проверяем, нужно ли передать вопрос админу
      if (shouldTransferToAdmin(userMessage, userRole)) {
        addMessage('bot', '🤖 Передаю ваш вопрос администратору. Скоро с вами свяжутся!', true);
        
        // Передаем вопрос администратору (демо-версия)
        addMessage('bot', '📧 Ваш вопрос передан администратору. Мы свяжемся с вами в ближайшее время!', true);
        
        // Имитируем ответ администратора через некоторое время
        setTimeout(() => {
          addMessage('admin', '👨‍💼 Спасибо за обращение! Ваш вопрос получен. Наш специалист изучит его и ответит в течение 24 часов.');
        }, 2000);
      } else {
        // Получаем ответ от бота
        const botResponse = getBotResponse(userMessage, userRole);
        addMessage('bot', botResponse);
      }
    }, 1000 + Math.random() * 2000); // Случайная задержка 1-3 секунды
  };



  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (text) => {
    // Заменяем переносы строк на <br>
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-96 flex flex-col">
        {/* Заголовок */}
        <div className="bg-[#FFD700] text-[#1a365d] px-4 py-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">SilkGate Поддержка</h3>
              <div className="flex items-center space-x-1 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Онлайн</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#1a365d] hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Область сообщений */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-[#FFD700] text-[#1a365d]'
                    : message.sender === 'admin'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-gray-100 text-gray-900'
                } ${message.isTransfer ? 'border-2 border-dashed border-orange-300' : ''}`}
              >
                <div className="text-sm">
                  {formatMessage(message.text)}
                </div>
                <div className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-[#1a365d]' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Индикатор печати */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Область ввода */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите сообщение..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              rows="1"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-[#FFD700] text-[#1a365d] px-4 py-2 rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {/* Подсказки */}
          <div className="mt-2 flex flex-wrap gap-1">
            {['Привет', 'Помощь', 'Тарифы', 'Контакты'].map((hint) => (
              <button
                key={hint}
                onClick={() => setInputMessage(hint)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotModal; 