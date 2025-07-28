import React, { useRef, useState, useEffect } from 'react';

const news = [
  {
    id: 1,
    title: 'Инвестиции в стартапы выросли на 30%',
    description: 'Аналитика рынка за 2024 год: новые тренды и возможности.',
    image: '/news/news1.jpg',
    date: '12.06.2024',
  },
  {
    id: 2,
    title: 'SilkGate запускает AI-агента для инвесторов',
    description: 'Теперь подбор проектов стал ещё умнее и быстрее.',
    image: '/news/news2.jpg',
    date: '10.06.2024',
  },
  {
    id: 3,
    title: 'Венчурные фонды: что изменилось?',
    description: 'Эксперты делятся мнением о будущем венчурного рынка.',
    image: '/news/news3.jpg',
    date: '08.06.2024',
  },
  {
    id: 4,
    title: 'Лучшие стартапы месяца',
    description: 'Обзор самых перспективных проектов июня.',
    image: '/news/news4.jpg',
    date: '05.06.2024',
  },
  {
    id: 5,
    title: 'Как привлечь инвестиции в 2024?',
    description: 'Пошаговое руководство для основателей.',
    image: '/news/news5.jpg',
    date: '01.06.2024',
  },
];

export default function NewsSlider() {
  const sliderRef = useRef(null);
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
          {news.map((item) => (
            <div
              key={item.id}
              className="relative min-w-[300px] max-w-[320px] h-[270px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer bg-[#1A2238]"
            >
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                draggable="false"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10182A]/80 via-[#10182A]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-xs text-gray-300 font-medium" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>{item.date}</span>
                <h3
                  className="mb-2 mt-1 text-2xl font-bold text-white leading-tight text-left"
                  style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.05 }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-xs text-gray-300 leading-tight text-left"
                  style={{ fontFamily: 'Inter, Arial, sans-serif', fontWeight: 400 }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
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