import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NewsSlider from '../components/NewsSlider';

const FAQS = [
  { q: 'Что такое SilkGate?', a: 'SilkGate — это платформа для стартапов и инвесторов, объединяющая лучшие проекты и капитал.' },
  { q: 'Как зарегистрироваться?', a: 'Нажмите "Войти" и выберите "Зарегистрируйтесь бесплатно" в форме.' },
  { q: 'Кто может стать инвестором?', a: 'Любой желающий, прошедший модерацию и одобренный администратором.' },
  { q: 'Как добавить стартап?', a: 'После регистрации выберите роль "Стартап" и заполните профиль.' },
  { q: 'Безопасны ли мои данные?', a: 'Да, мы используем современные методы защиты и не передаём ваши данные третьим лицам.' },
];

// Компонент статистики в стиле DVSY
function StatsSection() {
  const statItems = [
    { value: 100, suffix: '+', label: 'Стартапов', icon: (
      <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )},
    { value: 50, suffix: '+', label: 'Инвесторов', icon: (
      <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    { value: 20, suffix: '+', label: 'Сделок', icon: (
      <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { value: 10, suffix: 'M$', label: 'Привлечено', icon: (
      <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    )},
  ];
  const [animatedValues, setAnimatedValues] = useState(statItems.map(() => 0));
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          statItems.forEach((item, index) => {
            const targetValue = item.value;
            const duration = 2000;
            const steps = 60;
            const increment = targetValue / steps;
            let currentValue = 0;
            
            const timer = setInterval(() => {
              currentValue += increment;
              if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
              }
              setAnimatedValues(prev => {
                const newValues = [...prev];
                newValues[index] = Math.floor(currentValue);
                return newValues;
              });
            }, duration / steps);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16" ref={sectionRef}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {statItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-center mb-4">
              {item.icon}
            </div>
            <div className="text-3xl md:text-4xl font-light text-white mb-2">
              {animatedValues[index]}{item.suffix}
            </div>
            <p className="text-muted text-sm font-light">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Компонент услуг в стиле FYLLA
function ServicesSection() {
  const services = [
    { 
      name: 'ИНВЕСТИЦИИ', 
      description: 'Прямые инвестиции в перспективные стартапы с полным сопровождением сделок',
      icon: (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    { 
      name: 'АНАЛИТИКА', 
      description: 'Детальный анализ проектов, рынков и инвестиционных возможностей',
      icon: (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      name: 'КОНСУЛЬТАЦИИ', 
      description: 'Экспертная поддержка по инвестициям и развитию бизнеса',
      icon: (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      name: 'СОПРОВОЖДЕНИЕ', 
      description: 'Полное сопровождение сделок от начала до завершения',
      icon: (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-light text-left mb-12 text-white">
        ЧТО МЫ ДЕЛАЕМ
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div key={index} className="group">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                {service.icon}
              </div>
              <div>
                <h3 className="text-xl font-light text-white mb-3">{service.name}</h3>
                <p className="text-muted text-sm font-light leading-relaxed">{service.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Компонент новостей в стиле FYLLA
function NewsSection() {
  const navigate = useNavigate();
  
  const featuredNews = {
    id: 1,
    title: "Новый стартап в сфере AI привлек $10M инвестиций",
    content: "Компания TechVision, специализирующаяся на искусственном интеллекте, успешно завершила раунд финансирования серии A.",
    date: "2 часа назад",
    image: "/news/koncepcia-noutbuka-s-interfeisom-blue-hud.jpg"
  };
  
  const smallNews = [
    {
      id: 2,
      title: "Рост рынка финтех-стартапов",
      content: "Аналитики прогнозируют увеличение инвестиций в финтех-сектор на 25% в следующем году.",
      date: "4 часа назад",
      image: "/news/3d-rendering-sovremennogo-nizkopoligonal-nogo-dizaina-spletenia.jpg"
    },
    {
      id: 3,
      title: "Новые возможности для инвесторов",
      content: "Платформа запускает новые инструменты для анализа и управления инвестиционным портфелем.",
      date: "6 часов назад",
      image: "/news/svaz-svaz-podklucit-koncepcia-setevogo-edinenia.jpg"
    }
  ];

  const handleNewsClick = (newsId) => {
    // Переход на страницу конкретной новости
    navigate(`/news/${newsId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16">
      {/* Горизонтальная линия разделитель */}
      <div className="w-full h-px bg-gray-600 mb-16"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Левая колонка - заголовок, описание, кнопка */}
        <div className="lg:col-span-1">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
            ПОСЛЕДНИЕ НОВОСТИ
          </h2>
          <p className="text-muted text-sm font-light leading-tight mb-8">
            Актуальная информация о рынке инвестиций и новых возможностях для стартапов. Следите за последними трендами и событиями в мире технологий и бизнеса.
          </p>
          <Link 
            to="/news" 
            className="inline-block bg-white text-black px-6 py-3 text-sm font-light hover:bg-gray-100 transition-colors"
          >
            ВСЕ НОВОСТИ
          </Link>
        </div>
        
        {/* Правая колонка - большая новость и мелкие квадратики */}
        <div className="lg:col-span-2">
          {/* Большая новость */}
          <div className="mb-8">
            <div 
              className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => handleNewsClick(featuredNews.id)}
            >
              <img
                src={featuredNews.image}
                alt={featuredNews.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-light text-white mb-2 leading-tight">{featuredNews.title}</h3>
                <p className="text-gray-300 text-sm font-light mb-2 leading-tight">{featuredNews.content}</p>
                <span className="text-white text-sm font-light">{featuredNews.date}</span>
              </div>
            </div>
          </div>
          
          {/* Мелкие квадратики */}
          <div className="grid grid-cols-2 gap-6">
            {smallNews.map((news, index) => (
              <div 
                key={index} 
                className="group cursor-pointer"
                onClick={() => handleNewsClick(news.id)}
              >
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-lg font-light text-white mb-1 leading-tight">{news.title}</h4>
                    <span className="text-white text-sm font-light">{news.date}</span>
                  </div>
                </div>
                <p className="text-muted text-sm font-light leading-tight">{news.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Горизонтальная линия разделитель снизу */}
      <div className="w-full h-px bg-gray-600 mt-16"></div>
    </div>
  );
}

// Компонент демо-чата
function DemoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Привет! Я помогу вам узнать больше о SilkGate', isBot: true }
  ]);

  const quickQuestions = [
    'Как зарегистрироваться?',
    'Какие стартапы есть?',
    'Как инвестировать?'
  ];

  const handleQuickQuestion = (question) => {
    setMessages(prev => [...prev, { id: Date.now(), text: question, isBot: false }]);
    
    setTimeout(() => {
      const answers = {
        'Как зарегистрироваться?': 'Нажмите кнопку "Войти" в правом верхнем углу и выберите "Зарегистрироваться"',
        'Какие стартапы есть?': 'У нас есть стартапы в сферах AI, FinTech, HealthTech и других перспективных направлениях',
        'Как инвестировать?': 'После регистрации как инвестор вы сможете просматривать проекты и связываться с их авторами'
      };
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: answers[question] || 'Спасибо за вопрос! Наш менеджер свяжется с вами.', 
        isBot: true 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90 transition-all duration-300 animate-float"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      ) : (
        <div className="card-dark w-80 h-96 flex flex-col shadow-xl">
          {/* Заголовок чата */}
          <div className="gradient-primary p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold text-white">SilkGate Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-white/70"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Сообщения */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-secondary text-secondary-foreground'
                      : 'gradient-primary text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          {/* Быстрые вопросы */}
          <div className="p-4 border-t border-border">
            <div className="space-y-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="w-full text-left p-2 text-sm text-muted hover:bg-secondary rounded-lg transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FAQAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16">
      <h2 className="mb-6 text-2xl md:text-3xl font-light text-left text-white">FAQ</h2>
      {FAQS.map((item, idx) => (
        <div key={idx} className="border-b border-border py-2">
          <button
            className="w-full flex justify-between items-center focus:outline-none text-base md:text-lg text-white font-light text-left mb-1"
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <span>{item.q}</span>
            <span className="ml-2">
              {open === idx ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </span>
          </button>
          {open === idx && (
            <div className="pt-1 text-sm md:text-base text-muted text-left leading-relaxed">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative overflow-hidden pt-20">
      {/* Декоративные элементы */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/3 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Hero-блок в стиле FYLLA */}
      <div className="w-full max-w-4xl mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-light mb-6 text-white leading-tight">
              Мы соединяем стартапы с инвесторами
            </h1>
            <p className="text-lg md:text-xl text-muted font-light leading-relaxed">
              Платформа для перспективных проектов и проверенных инвесторов. Поднимаем бренды через креативные цифровые решения.
            </p>
          </div>
          <div className="relative">
            <div className="w-full h-80 rounded-lg overflow-hidden border border-white/20">
              <img
                src="/news/3d-rendering-sovremennogo-nizkopoligonal-nogo-dizaina-spletenia.jpg"
                alt="SilkGate Platform"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <StatsSection />

      {/* Услуги */}
      <ServicesSection />

      {/* Новости */}
      <NewsSection />

      {/* FAQ */}
      <FAQAccordion />

      {/* Демо-чат */}
      <DemoChat />
    </div>
  );
} 