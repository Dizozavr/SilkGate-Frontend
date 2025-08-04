import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function News() {
  const navigate = useNavigate();
  
  // Демо-данные новостей (одобренные админом)
  const news = [
    {
      id: 1,
      title: "Новый стартап в сфере AI привлек $10M инвестиций",
      content: "Компания TechVision, специализирующаяся на искусственном интеллекте, успешно завершила раунд финансирования серии A. Инвестиции в размере $10 миллионов будут направлены на развитие технологий машинного обучения и расширение команды разработчиков.",
      date: "2 часа назад",
      image: "/news/koncepcia-noutbuka-s-interfeisom-blue-hud.jpg",
      source: "TechCrunch",
      category: "AI/ML"
    },
    {
      id: 2,
      title: "Рост рынка финтех-стартапов",
      content: "Аналитики прогнозируют увеличение инвестиций в финтех-сектор на 25% в следующем году. Согласно последним исследованиям, рынок финтех-стартапов показывает стабильный рост, привлекая внимание как частных, так и институциональных инвесторов.",
      date: "4 часа назад",
      image: "/news/3d-rendering-sovremennogo-nizkopoligonal-nogo-dizaina-spletenia.jpg",
      source: "Forbes",
      category: "FinTech"
    },
    {
      id: 3,
      title: "Новые возможности для инвесторов",
      content: "Платформа запускает новые инструменты для анализа и управления инвестиционным портфелем. В рамках обновления системы инвесторы получат доступ к расширенной аналитике, персональным рекомендациям и автоматизированным инструментам управления рисками.",
      date: "6 часов назад",
      image: "/news/svaz-svaz-podklucit-koncepcia-setevogo-edinenia.jpg",
      source: "SilkGate",
      category: "Платформа"
    },
    {
      id: 4,
      title: "Стартап ИИ привлекает млн в посевном раунде",
      content: "Многообещающий стартап ИИ успешно привлек млн в посевном финансировании. Компания специализируется на разработке инновационных решений машинного обучения для корпоративных клиентов. Это финансирование поможет ускорить разработку продукта и расширить команду.",
      date: "1 день назад",
      image: "/news/3d-fon-soedinenia-s-nizkopoligonal-nymi-soedinitel-nymi-liniami-i-tockami.jpg",
      source: "TechCrunch",
      category: "AI/ML"
    },
    {
      id: 5,
      title: "Блокчейн-стартап получил $5M инвестиций",
      content: "Инновационный блокчейн-стартап привлек $5 миллионов в раунде финансирования. Компания разрабатывает децентрализованные решения для финансового сектора, что привлекло внимание крупных инвесторов.",
      date: "2 дня назад",
      image: "/news/koncepcia-kollaza-avatara-metavselennoi.jpg",
      source: "CoinDesk",
      category: "Blockchain"
    },
    {
      id: 6,
      title: "Новые тренды в EdTech индустрии",
      content: "Образовательные технологии переживают бум инвестиций. Стартапы в сфере EdTech привлекают рекордные суммы, так как спрос на онлайн-образование продолжает расти.",
      date: "3 дня назад",
      image: "/news/fonovyi-kollaz-programmirovania (3).jpg",
      source: "EdTech Weekly",
      category: "EdTech"
    }
  ];

  const handleNewsClick = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  return (
    <div className="min-h-screen bg-[#10182A] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
            Блог / Новости
          </h1>
          <p className="text-lg text-muted font-light max-w-2xl">
            Последние новости и обновления SilkGate. Все публикации проходят модерацию и одобрение администратора.
          </p>
        </div>
        
        {/* Список новостей */}
        <div className="grid gap-8">
          {news.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleNewsClick(item.id)}
            >
              <div className="flex items-start gap-6">
                {/* Изображение */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Контент */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-light text-gray-900 mb-3 leading-tight">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-sm font-light leading-tight mb-4">
                    {item.content}
                  </p>
                  
                  {/* Метаданные */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-light text-gray-500">
                        {item.source}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-light rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-sm font-light text-gray-500">
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Демо-информация */}
        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-light text-white mb-4">Демо-версия</h3>
          <p className="text-muted text-sm font-light leading-tight">
            Это демо-страница со списком всех одобренных новостей. В полной версии здесь будут отображаться новости, 
            которые прошли модерацию администратора. Каждая новость кликабельна и ведет на страницу с полным содержанием.
          </p>
        </div>
      </div>
    </div>
  );
} 