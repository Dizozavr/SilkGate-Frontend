import React from 'react';
import { useParams, Link } from 'react-router-dom';

const NewsDetail = () => {
  const { id } = useParams();
  
  // Демо-данные новостей
  const newsData = {
    1: {
      title: "Новый стартап в сфере AI привлек $10M инвестиций",
      content: `Компания TechVision, специализирующаяся на искусственном интеллекте, успешно завершила раунд финансирования серии A. 
      
      Инвестиции в размере $10 миллионов будут направлены на развитие технологий машинного обучения и расширение команды разработчиков. 
      
      "Мы рады приветствовать новых инвесторов в нашем проекте. Эти средства позволят нам ускорить разработку инновационных решений в области AI", - заявил CEO компании Михаил Петров.`,
      date: "2 часа назад",
      image: "/news/koncepcia-noutbuka-s-interfeisom-blue-hud.jpg",
      author: "Редакция SilkGate",
      category: "AI/ML"
    },
    2: {
      title: "Рост рынка финтех-стартапов",
      content: `Аналитики прогнозируют увеличение инвестиций в финтех-сектор на 25% в следующем году.
      
      Согласно последним исследованиям, рынок финтех-стартапов показывает стабильный рост, привлекая внимание как частных, так и институциональных инвесторов.
      
      Основными драйверами роста являются развитие блокчейн-технологий, цифровизация банковских услуг и растущий спрос на инновационные финансовые решения.`,
      date: "4 часа назад",
      image: "/news/3d-rendering-sovremennogo-nizkopoligonal-nogo-dizaina-spletenia.jpg",
      author: "Аналитический отдел",
      category: "FinTech"
    },
    3: {
      title: "Новые возможности для инвесторов",
      content: `Платформа запускает новые инструменты для анализа и управления инвестиционным портфелем.
      
      В рамках обновления системы инвесторы получат доступ к расширенной аналитике, персональным рекомендациям и автоматизированным инструментам управления рисками.
      
      "Наша цель - сделать инвестирование более доступным и эффективным для всех участников рынка", - отметил технический директор платформы.`,
      date: "6 часов назад",
      image: "/news/svaz-svaz-podklucit-koncepcia-setevogo-edinenia.jpg",
      author: "Команда разработки",
      category: "Платформа"
    },
    4: {
      title: "Стартап ИИ привлекает млн в посевном раунде",
      content: `Многообещающий стартап ИИ успешно привлек млн в посевном финансировании. Компания специализируется на разработке инновационных решений машинного обучения для корпоративных клиентов.
      
      Это финансирование поможет ускорить разработку продукта и расширить команду. Основатели компании заявили, что планируют использовать полученные средства для масштабирования технологий и выхода на международные рынки.
      
      "Мы видим огромный потенциал в применении наших AI-решений в корпоративном секторе", - отметил основатель стартапа.`,
      date: "1 день назад",
      image: "/news/3d-fon-soedinenia-s-nizkopoligonal-nymi-soedinitel-nymi-liniami-i-tockami.jpg",
      author: "TechCrunch",
      category: "AI/ML"
    },
    5: {
      title: "Блокчейн-стартап получил $5M инвестиций",
      content: `Инновационный блокчейн-стартап привлек $5 миллионов в раунде финансирования. Компания разрабатывает децентрализованные решения для финансового сектора, что привлекло внимание крупных инвесторов.
      
      Проект направлен на создание инфраструктуры для безопасных и прозрачных финансовых транзакций. Инвестиции будут использованы для развития технологической платформы и расширения команды разработчиков.
      
      "Блокчейн-технологии открывают новые возможности для финансового сектора", - заявил представитель инвесторов.`,
      date: "2 дня назад",
      image: "/news/koncepcia-kollaza-avatara-metavselennoi.jpg",
      author: "CoinDesk",
      category: "Blockchain"
    },
    6: {
      title: "Новые тренды в EdTech индустрии",
      content: `Образовательные технологии переживают бум инвестиций. Стартапы в сфере EdTech привлекают рекордные суммы, так как спрос на онлайн-образование продолжает расти.
      
      Аналитики отмечают, что пандемия ускорила цифровизацию образования, что привело к росту инвестиций в EdTech-сектор. Новые технологии, включая виртуальную реальность и искусственный интеллект, активно внедряются в образовательный процесс.
      
      "EdTech становится одним из самых перспективных направлений для инвестиций", - отмечают эксперты.`,
      date: "3 дня назад",
      image: "/news/fonovyi-kollaz-programmirovania (3).jpg",
      author: "EdTech Weekly",
      category: "EdTech"
    }
  };

  const news = newsData[id];

  if (!news) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white mb-4">Новость не найдена</h1>
          <Link to="/" className="text-primary hover:underline">Вернуться на главную</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Кнопка назад */}
        <Link 
          to="/news" 
          className="inline-flex items-center text-muted hover:text-white mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к новостям
        </Link>

        {/* Заголовок новости */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-light text-muted">{news.category}</span>
            <span className="text-sm font-light text-muted">•</span>
            <span className="text-sm font-light text-muted">{news.date}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-white leading-tight mb-4">
            {news.title}
          </h1>
          <p className="text-muted text-sm font-light">Автор: {news.author}</p>
        </div>

        {/* Изображение */}
        <div className="mb-8">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Содержание */}
        <div className="prose prose-invert max-w-none">
          <div className="text-muted text-base font-light leading-relaxed whitespace-pre-line">
            {news.content}
          </div>
        </div>

        {/* Демо-информация */}
        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-light text-white mb-4">Демо-версия</h3>
          <p className="text-muted text-sm font-light leading-tight">
            Это демо-страница новости. В полной версии здесь будет расширенное содержание, комментарии, 
            связанные новости и другие интерактивные элементы.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail; 