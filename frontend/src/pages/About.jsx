import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-['Playfair_Display']">О нас</h1>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl font-['Inter']">SilkGate — это команда экспертов в области стартапов, инвестиций и технологий. Наша миссия — соединять лучшие проекты с лучшими инвесторами и создавать экосистему для роста.</p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-blue-600 font-bold text-xl mb-4 font-['Playfair_Display']">Миссия</div>
            <div className="text-gray-700 leading-relaxed font-['Inter']">Создавать прозрачную, эффективную и безопасную среду для развития инноваций и инвестиций.</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-blue-600 font-bold text-xl mb-4 font-['Playfair_Display']">Команда</div>
            <div className="text-gray-700 leading-relaxed font-['Inter']">Наша команда — это специалисты с опытом в венчурных фондах, IT, юридической поддержке и маркетинге.</div>
          </div>
        </div>
        
        <div className="mt-10 bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="text-blue-600 font-bold text-xl mb-4 font-['Playfair_Display']">Наши ценности</div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold text-gray-800 mb-2 font-['Playfair_Display']">Инновации</div>
              <div className="text-gray-600 text-sm font-['Inter']">Постоянное развитие и внедрение новых технологий</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🤝</div>
              <div className="font-semibold text-gray-800 mb-2 font-['Playfair_Display']">Партнерство</div>
              <div className="text-gray-600 text-sm font-['Inter']">Долгосрочные отношения с клиентами и партнерами</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔒</div>
              <div className="font-semibold text-gray-800 mb-2 font-['Playfair_Display']">Безопасность</div>
              <div className="text-gray-600 text-sm font-['Inter']">Защита данных и конфиденциальность</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 