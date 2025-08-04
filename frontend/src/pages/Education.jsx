import React from 'react';
import Icon from '../components/Shared/Icon';

export default function Education() {
  const events = [
    {
      id: 1,
      title: "AI для стартапов",
      date: "15.08.2024",
      time: "14:00 - 16:00",
      description: "Практический семинар по внедрению искусственного интеллекта в стартап-проекты.",
      speaker: "Алексей Петров",
      category: "AI/ML",
      image: "/news/3d-rendering-sovremennogo-nizkopoligonal-nogo-dizaina-spletenia.jpg"
    },
    {
      id: 2,
      title: "Финансовое моделирование",
      date: "22.08.2024",
      time: "15:00 - 17:00",
      description: "Как правильно строить финансовые модели для привлечения инвестиций.",
      speaker: "Мария Сидорова",
      category: "Финансы",
      image: "/news/koncepcia-noutbuka-s-interfeisom-blue-hud.jpg"
    },
    {
      id: 3,
      title: "Питчинг проектов",
      date: "29.08.2024",
      time: "16:00 - 18:00",
      description: "Искусство презентации стартапа перед инвесторами и партнерами.",
      speaker: "Дмитрий Козлов",
      category: "Презентации",
      image: "/news/svaz-svaz-podklucit-koncepcia-setevogo-edinenia.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#10182A] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
            Образование
          </h1>
          <p className="text-lg text-muted font-light max-w-2xl leading-tight">
            Семинары, мастер-классы и образовательные программы для развития ваших навыков в сфере стартапов и инвестиций.
          </p>
        </div>
        
        {/* Статистика */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Icon name="user" size={32} />
            </div>
            <h3 className="text-2xl font-light text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600 text-sm font-light leading-tight">Участников</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Icon name="award" size={32} />
            </div>
            <h3 className="text-2xl font-light text-gray-900 mb-2">25+</h3>
            <p className="text-gray-600 text-sm font-light leading-tight">Мероприятий</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Icon name="heart" size={32} />
            </div>
            <h3 className="text-2xl font-light text-gray-900 mb-2">98%</h3>
            <p className="text-gray-600 text-sm font-light leading-tight">Довольных участников</p>
          </div>
        </div>
        
        {/* Ближайшие события */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-white mb-8">Ближайшие события</h2>
          <div className="grid gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-6">
                  {/* Изображение */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-lg overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Контент */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-light text-gray-900 leading-tight">
                        {event.title}
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-light rounded-full">
                        {event.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm font-light leading-tight mb-4">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Icon name="time" size={16} />
                          <span className="text-sm font-light text-gray-500">
                            {event.date} • {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="user" size={16} />
                          <span className="text-sm font-light text-gray-500">
                            {event.speaker}
                          </span>
                        </div>
                      </div>
                      
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-light">
                        Записаться
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Календарь событий */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <div className="flex items-center mb-6">
            <Icon name="time" size={32} className="mr-4" />
            <h2 className="text-xl font-light text-gray-900">Календарь событий</h2>
          </div>
          <p className="text-gray-600 text-sm font-light leading-tight mb-6">
            Следите за нашими образовательными мероприятиями и не пропускайте важные события.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-light">
            Открыть календарь
          </button>
        </div>
        
        {/* Демо-информация */}
        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-light text-white mb-4">Демо-версия</h3>
          <p className="text-muted text-sm font-light leading-tight">
            Это демо-страница образования. В полной версии здесь будет календарь реальных мероприятий, 
            система регистрации на семинары и интеграция с образовательными платформами.
          </p>
        </div>
      </div>
    </div>
  );
} 