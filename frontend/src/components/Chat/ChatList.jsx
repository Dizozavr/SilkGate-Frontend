import React, { useState } from 'react';

const ChatList = ({ onSelectChat, onNewChat }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);

  // Демо-данные чатов
  const chats = [
    {
      id: 1,
      name: 'Мастер',
      lastMessage: 'Привет! Это демо-режим чата...',
      timestamp: '15:45',
      unread: 0,
      avatar: 'М',
      isDemo: true,
      participants: ['current-user', 'master'],
      maxParticipants: 3
    },
    {
      id: 2,
      name: 'Анна Петрова',
      lastMessage: 'Здравствуйте! Готова помочь с юридическими вопросами',
      timestamp: '14:30',
      unread: 2,
      avatar: 'АП',
      isDemo: false,
      participants: ['current-user', 'anna-petrov'],
      maxParticipants: 3
    },
    {
      id: 3,
      name: 'Михаил Сидоров',
      lastMessage: 'Отличная идея! Давайте обсудим детали',
      timestamp: '12:15',
      unread: 0,
      avatar: 'МС',
      isDemo: false,
      participants: ['current-user', 'mikhail-sid'],
      maxParticipants: 3
    }
  ];

  const handleChatSelect = (chat) => {
    setSelectedChatId(chat.id);
    onSelectChat(chat);
  };



  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Заголовок */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-light text-gray-900">Чаты</h2>
          <button
            onClick={() => onNewChat()}
            className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors"
            title="Новый чат"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Список чатов */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatSelect(chat)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedChatId === chat.id ? 'bg-blue-50 border-l-4 border-l-[#3B82F6]' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Аватар */}
              <div className="relative">
                <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center">
                  <span className="text-white font-light text-sm">{chat.avatar}</span>
                </div>
                {chat.isDemo && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">Д</span>
                  </div>
                )}
              </div>

              {/* Информация о чате */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-light text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">
                    {chat.participants.length}/{chat.maxParticipants} участников
                  </span>
                  {chat.unread > 0 && (
                    <span className="bg-[#3B82F6] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {chat.unread}
                    </span>
                  )}
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