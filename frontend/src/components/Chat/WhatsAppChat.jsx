import React, { useState, useEffect, useRef } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const WhatsAppChat = ({ startupData, onClose }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showExpertsPanel, setShowExpertsPanel] = useState(false);
  const [chats, setChats] = useState([]);

  // Список специалистов для приглашения
  const experts = [
    {
      id: 1,
      name: 'Анна Петрова',
      role: 'Юрист',
      specialization: 'Корпоративное право',
      rating: 4.9,
      experience: '8 лет',
      avatar: 'АП',
      category: 'legal',
      online: true
    },
    {
      id: 2,
      name: 'Михаил Сидоров',
      role: 'Финансовый консультант',
      specialization: 'Инвестиции и финансы',
      rating: 4.8,
      experience: '12 лет',
      avatar: 'МС',
      category: 'finance',
      online: true
    },
    {
      id: 3,
      name: 'Елена Козлова',
      role: 'Бухгалтер',
      specialization: 'Налоговое планирование',
      rating: 4.7,
      experience: '6 лет',
      avatar: 'ЕК',
      category: 'accounting',
      online: false
    },
    {
      id: 4,
      name: 'Дмитрий Волков',
      role: 'IT-консультант',
      specialization: 'Техническая экспертиза',
      rating: 4.9,
      experience: '10 лет',
      avatar: 'ДВ',
      category: 'tech',
      online: true
    },
    {
      id: 5,
      name: 'Ольга Морозова',
      role: 'Маркетолог',
      specialization: 'Цифровой маркетинг',
      rating: 4.6,
      experience: '7 лет',
      avatar: 'ОМ',
      category: 'marketing',
      online: false
    }
  ];

  // Создаем чат со стартапером при инициализации
  useEffect(() => {
    if (startupData && !selectedChat) {
      const startupChat = {
        id: Date.now(),
        name: startupData.name || 'Стартапер',
        lastMessage: `Начато общение с ${startupData.name || 'стартапером'}`,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        unread: 0,
        avatar: startupData.name?.charAt(0) || 'С',
        isDemo: false,
        participants: ['current-user', 'startup'],
        maxParticipants: 5, // Увеличиваем лимит для приглашения специалистов
        messages: [
          {
            _id: `welcome-${Date.now()}`,
            content: `Здравствуйте! Я ${startupData.name || 'представитель стартапа'}. Готов обсудить наш проект и ответить на ваши вопросы.`,
            sender: { user_id: 'startup' },
            created_at: new Date().toISOString(),
            isVerified: true
          }
        ],
        invitedExperts: [] // Список приглашенных специалистов
      };
      
      setChats([startupChat]);
      setSelectedChat(startupChat);
    }
  }, [startupData]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    // Отмечаем сообщения как прочитанные
    if (chat.unread > 0) {
      setChats(prev => prev.map(c => 
        c.id === chat.id ? { ...c, unread: 0 } : c
      ));
    }
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      name: 'Новый чат',
      lastMessage: 'Начните общение',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      avatar: 'Н',
      isDemo: true,
      participants: ['current-user'],
      maxParticipants: 5,
      messages: [],
      invitedExperts: []
    };
    setChats(prev => [newChat, ...prev]);
    setSelectedChat(newChat);
  };

  const handleInviteExpert = (expert) => {
    if (selectedChat && selectedChat.participants.length < selectedChat.maxParticipants) {
      const expertId = `expert-${expert.id}`;
      
      // Проверяем, не приглашен ли уже этот специалист
      if (selectedChat.invitedExperts.some(e => e.id === expert.id)) {
        alert('Этот специалист уже приглашен в чат');
        return;
      }

      const expertMessage = {
        _id: `expert-${Date.now()}`,
        content: `Специалист ${expert.name} (${expert.role}) присоединился к чату`,
        sender: { user_id: 'system' },
        created_at: new Date().toISOString(),
        isVerified: true
      };
      
      const updatedChat = {
        ...selectedChat,
        participants: [...selectedChat.participants, expertId],
        messages: [...selectedChat.messages, expertMessage],
        lastMessage: `Специалист ${expert.name} присоединился`,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        invitedExperts: [...selectedChat.invitedExperts, expert]
      };
      
      setChats(prev => prev.map(c => c.id === selectedChat.id ? updatedChat : c));
      setSelectedChat(updatedChat);
    } else {
      alert('Достигнут лимит участников чата');
    }
  };

  const handleRemoveExpert = (expert) => {
    if (selectedChat) {
      const expertId = `expert-${expert.id}`;
      
      const leaveMessage = {
        _id: `leave-${Date.now()}`,
        content: `Специалист ${expert.name} покинул чат`,
        sender: { user_id: 'system' },
        created_at: new Date().toISOString(),
        isVerified: true
      };
      
      const updatedChat = {
        ...selectedChat,
        participants: selectedChat.participants.filter(p => p !== expertId),
        messages: [...selectedChat.messages, leaveMessage],
        lastMessage: `Специалист ${expert.name} покинул чат`,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        invitedExperts: selectedChat.invitedExperts.filter(e => e.id !== expert.id)
      };
      
      setChats(prev => prev.map(c => c.id === selectedChat.id ? updatedChat : c));
      setSelectedChat(updatedChat);
    }
  };

  const handleMessageSent = (message) => {
    if (selectedChat) {
      const updatedChats = chats.map(chat => {
        if (chat.id === selectedChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, message],
            lastMessage: message.content,
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
          };
        }
        return chat;
      });
      
      setChats(updatedChats);
      setSelectedChat(updatedChats.find(c => c.id === selectedChat.id));
    }
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    setShowExpertsPanel(false);
    // Закрываем чат полностью
    if (onClose) {
      // Если передана функция onClose (из дашборда), используем её
      onClose();
    } else {
      // Если мы на прямой странице чата, возвращаемся на главную
      window.history.back();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Общий крестик для закрытия */}
      <button
        onClick={handleCloseChat}
        className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-600 transition-colors"
        title="Закрыть чат"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {/* Левая панель - Специалисты для приглашения */}
      <div className="w-1/3 min-w-80 bg-white border-r border-gray-200">
        {/* Заголовок */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-light text-gray-900">Пригласить специалиста</h2>
            <div className="text-sm text-gray-500">
              {selectedChat?.invitedExperts?.length || 0} приглашено
            </div>
          </div>
        </div>

        {/* Список специалистов */}
        <div className="flex-1 overflow-y-auto">
          {experts.map((expert) => {
            const isInvited = selectedChat?.invitedExperts?.some(e => e.id === expert.id);
            return (
              <div
                key={expert.id}
                className="p-4 border-b border-gray-100 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  {/* Аватар */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center">
                      <span className="text-white font-light text-sm">{expert.avatar}</span>
                    </div>
                    {expert.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Информация о специалисте */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-light text-gray-900">{expert.name}</h3>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600">{expert.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm font-light text-[#3B82F6]">{expert.role}</p>
                    <p className="text-xs text-gray-500">{expert.specialization}</p>
                    <p className="text-xs text-gray-400">Опыт: {expert.experience}</p>
                  </div>

                  {/* Кнопка приглашения/удаления */}
                  {isInvited ? (
                    <button 
                      onClick={() => handleRemoveExpert(expert)}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors font-light"
                    >
                      Убрать
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleInviteExpert(expert)}
                      className="px-3 py-1 bg-[#3B82F6] text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-light"
                    >
                      Пригласить
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Правая панель - Окно чата */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow
            conversation={selectedChat}
            onMessageSent={handleMessageSent}
            onClose={handleCloseChat}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-light mb-2">Чат со стартапером</h3>
              <p className="text-sm">Пригласите специалистов для консультации</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChat; 