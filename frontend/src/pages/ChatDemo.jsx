import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ChatDemo = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  // Демо-данные чатов
  const demoChats = [
    {
      id: 1,
      name: 'Стартап "ЭкоТех"',
      lastMessage: 'Здравствуйте! Интересует ли вас наше предложение?',
      time: '14:30',
      unread: 2,
      avatar: '🌱',
      status: 'online'
    },
    {
      id: 2,
      name: 'Стартап "AI Assistant"',
      lastMessage: 'Отправили вам презентацию проекта',
      time: '12:15',
      unread: 0,
      avatar: '🤖',
      status: 'online'
    },
    {
      id: 3,
      name: 'Стартап "FinTech Pro"',
      lastMessage: 'Спасибо за обратную связь!',
      time: 'Вчера',
      unread: 1,
      avatar: '💰',
      status: 'offline'
    },
    {
      id: 4,
      name: 'Стартап "HealthTech"',
      lastMessage: 'Готовы к встрече в любое время',
      time: '2 дня назад',
      unread: 0,
      avatar: '🏥',
      status: 'online'
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = demoChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold text-gray-900">Сообщения</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая панель - список чатов */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Поиск */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Поиск чатов..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Список чатов */}
              <div className="max-h-96 overflow-y-auto">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-2xl">
                          {chat.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          chat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {chat.name}
                          </h3>
                          <span className="text-xs text-gray-500">{chat.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {chat.lastMessage}
                        </p>
                      </div>
                      {chat.unread > 0 && (
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                            {chat.unread}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Статистика */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Всего чатов: <span className="font-semibold">{demoChats.length}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Демо-версия • Сообщения не сохраняются
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Правая панель - выбранный чат */}
          <div className="lg:col-span-2">
            {selectedChat ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Заголовок чата */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-xl">
                          {selectedChat.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          selectedChat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {selectedChat.name}
                          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Демо
                          </span>
                        </h2>
                        <p className="text-sm text-gray-500 flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            selectedChat.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                          }`}></span>
                          {selectedChat.status === 'online' ? 'Онлайн' : 'Не в сети'}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Область сообщений */}
                <div className="h-96 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                  <div className="space-y-4">
                    {/* Приветственное сообщение */}
                    <div className="flex justify-start">
                      <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            {selectedChat.avatar}
                          </span>
                        </div>
                        <div className="px-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-md shadow-sm">
                          <p className="text-sm leading-relaxed">
                            Здравствуйте! Это демо-версия чата. В реальном режиме здесь будут отображаться сообщения между участниками.
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-purple-600 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              Демо сообщение
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Последнее сообщение */}
                    <div className="flex justify-start">
                      <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            {selectedChat.avatar}
                          </span>
                        </div>
                        <div className="px-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-md shadow-sm">
                          <p className="text-sm leading-relaxed">{selectedChat.lastMessage}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-400">{selectedChat.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Форма отправки */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Введите сообщение..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                        disabled
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                        Демо
                      </div>
                    </div>
                    <button
                      disabled
                      className="px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    В демо-режиме отправка сообщений отключена
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Выберите чат</h3>
                  <p className="text-gray-500">
                    Выберите чат из списка слева, чтобы начать общение
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDemo; 