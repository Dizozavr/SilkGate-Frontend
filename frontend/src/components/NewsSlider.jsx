import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Функция для выбора изображения на основе ID новости
const getImageForNews = (newsId) => {
  const images = [
    'news1.jpg', 'news2.jpg', 'news3.jpg', 'news4.jpg', 'news5.jpg', 'news6.jpg',
    'svaz-svaz-podklucit-koncepcia-setevogo-edinenia.jpg',
    '3d-rendering-sovremennogo-nizkopoligonal-nogo-dizaina-spletenia.jpg',
    '3d-fon-soedinenia-s-nizkopoligonal-nymi-soedinitel-nymi-liniami-i-tockami.jpg',
    'koncepcia-noutbuka-s-interfeisom-blue-hud.jpg',
    'koncepcia-kollaza-avatara-metavselennoi.jpg',
    'fonovyi-kollaz-programmirovania (3).jpg',
    'biznesmen-derzasii-cifrovoi-ekran-kotoryi-sgeneriroval-globus.jpg',
    'fonovyi-kollaz-programmirovania (2).jpg',
    'fonovyi-kollaz-programmirovania (1).jpg',
    'fonovyi-kollaz-programmirovania.jpg',
    'biznesmen-rabotausii-s-planseta-v-ofise-krupnym-planom.jpg',
    'molodye-rabotniki-sida-v-ofise-na-tablice-i-ispol-zua-komp-ter-knizku-koncepciu-vstreci-metoda-mozgovogo-sturma-kollektivnoi-raboty.jpg',
    'biznesmen-s-kozanym-portfelem.jpg',
    'delovaa-gruppa-rabocaa-vstreca-koncepcia-mozgovogo-sturma.jpg',
    'krupnym-planom-planseta-i-dokumentov-na-stole.jpg',
    'dva-molodyh-biznesmena-imeusie-uspesnuu-vstrecu-v-restorane.jpg',
    'celovek-daet-predstavlenie-gistogrammy-s-pomos-u-vysokotehnologicnogo-cifrovogo-pera.jpg',
    'delovye-ludi-pozimaa-ruki.jpg',
    'krupnym-planom-biznesmen-s-cifrovym-plansetom.jpg',
    'gruppa-raznoobraznyh-ludei-imeusih-delovuu-vstrecu.jpg'
  ];
  
  if (!newsId) return images[0];
  
  // Используем хеш от ID для выбора изображения
  const hash = newsId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return images[Math.abs(hash) % images.length];
};

// Функция для получения новостей с API
const fetchNews = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/news/published?limit=10');
    if (response.ok) {
      const data = await response.json();
      return data.news || [];
    }
  } catch (error) {
    console.error('Error fetching news:', error);
  }
  return [];
};

// Fallback новости если API недоступен
const fallbackNews = [
  {
    _id: 1,
    title: { translated: 'Инвестиции в стартапы выросли на 30%' },
    content: { translated: 'Аналитика рынка за 2024 год: новые тренды и возможности.' },
    image: { url: '/news/news1.jpg' },
    publishedAt: new Date(),
    source: { name: 'SilkGate' }
  },
  {
    _id: 2,
    title: { translated: 'SilkGate запускает AI-агента для инвесторов' },
    content: { translated: 'Теперь подбор проектов стал ещё умнее и быстрее.' },
    image: { url: '/news/news2.jpg' },
    publishedAt: new Date(),
    source: { name: 'SilkGate' }
  }
];

export default function NewsSlider() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [news, setNews] = useState(fallbackNews);
  const [loading, setLoading] = useState(true);


  // Загружаем новости при монтировании компонента
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const fetchedNews = await fetchNews();
      if (fetchedNews.length > 0) {
        setNews(fetchedNews);
      }
      setLoading(false);
    };

    loadNews();
  }, []);

  // Прокрутка по стрелкам
  const scrollBy = (offset) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Прокрутка к определённому слайду
  const scrollToIndex = (idx) => {
    if (sliderRef.current) {
      const card = sliderRef.current.children[idx];
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }
  };

  // Отслеживание активного слайда
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const handleScroll = () => {
      const scrollLeft = slider.scrollLeft;
      const cardWidth = slider.firstChild?.offsetWidth || 1;
      const idx = Math.round(scrollLeft / (cardWidth + 24)); // 24px — gap-6
      setActive(Math.min(Math.max(idx, 0), news.length - 1));
    };
    slider.addEventListener('scroll', handleScroll);
    return () => slider.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto mt-16">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2
          className="text-xl md:text-2xl text-white font-bold"
          style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}
        >
          Новости
        </h2>
        <a href="/news" className="text-[#FFD700] font-medium hover:underline text-xs md:text-sm" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>Все новости →</a>
      </div>
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Стрелка влево */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#10182A] bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-90 transition hidden sm:block"
          onClick={() => scrollBy(-340)}
          aria-label="Назад"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#FFD700" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        {/* Слайдер */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto px-1 scrollbar-hide custom-scrollbar"
          style={{ scrollBehavior: 'smooth' }}
        >
          {loading ? (
            // Skeleton loader
            Array.from({ length: 3 }).map((_, index) => (
                              <div
                  key={index}
                  className="relative min-w-[300px] max-w-[320px] h-[320px] rounded-2xl overflow-hidden shadow-lg bg-[#1A2238] animate-pulse"
                >
                <div className="w-full h-full bg-gray-700" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="h-3 bg-gray-600 rounded mb-2 w-20" />
                  <div className="h-6 bg-gray-600 rounded mb-2 w-full" />
                  <div className="h-4 bg-gray-600 rounded w-3/4" />
                </div>
              </div>
            ))
          ) : (
            news.map((item) => (
              <div
                key={item._id}
                className="relative min-w-[300px] max-w-[320px] h-[320px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer bg-[#1A2238]"
                onClick={() => navigate(`/news/${item._id}`)}
              >
                <img
                  src={`/news/${getImageForNews(item._id)}`}
                  alt={item.title?.translated || 'Новость'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  draggable="false"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10182A]/80 via-[#10182A]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300 font-medium" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('ru-RU') : 'Сегодня'}
                    </span>
                    <span className="text-xs text-[#FFD700] font-medium" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
                      {item.source?.name || 'SilkGate'}
                    </span>
                  </div>
                  <h3
                    className="mb-2 text-lg font-bold text-white leading-tight text-left"
                    style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.05 }}
                  >
                    {item.title?.translated || 'Новость'}
                  </h3>
                  <p
                    className="text-sm text-gray-300 leading-tight text-left line-clamp-3"
                    style={{ fontFamily: 'Inter, Arial, sans-serif', fontWeight: 400 }}
                  >
                    {item.content?.translated || 'Описание новости...'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Стрелка вправо */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#10182A] bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-90 transition hidden sm:block"
          onClick={() => scrollBy(340)}
          aria-label="Вперёд"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#FFD700" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      {/* Стили для скрытия скроллбара */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
} 