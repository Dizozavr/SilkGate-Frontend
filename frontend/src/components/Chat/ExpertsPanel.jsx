import React, { useState } from 'react';

const ExpertsPanel = ({ onInviteExpert, isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Демо-данные экспертов
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

  const categories = [
    { id: 'all', name: 'Все эксперты', count: experts.length },
    { id: 'legal', name: 'Юристы', count: experts.filter(e => e.category === 'legal').length },
    { id: 'finance', name: 'Финансы', count: experts.filter(e => e.category === 'finance').length },
    { id: 'accounting', name: 'Бухгалтерия', count: experts.filter(e => e.category === 'accounting').length },
    { id: 'tech', name: 'IT', count: experts.filter(e => e.category === 'tech').length },
    { id: 'marketing', name: 'Маркетинг', count: experts.filter(e => e.category === 'marketing').length }
  ];

  const filteredExperts = selectedCategory === 'all' 
    ? experts 
    : experts.filter(expert => expert.category === selectedCategory);

  const handleInvite = (expert) => {
    onInviteExpert(expert);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Заголовок */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-light text-gray-900">Пригласить эксперта</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Категории */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-lg text-sm font-light transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Список экспертов */}
        <div className="overflow-y-auto max-h-96">
          {filteredExperts.map(expert => (
            <div
              key={expert.id}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleInvite(expert)}
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

                {/* Информация */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-light text-gray-900">{expert.name}</h4>
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

                {/* Кнопка приглашения */}
                <button
                  className="px-3 py-1 bg-[#3B82F6] text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-light"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInvite(expert);
                  }}
                >
                  Пригласить
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Подвал */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Эксперты помогут вам с профессиональными вопросами
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpertsPanel; 