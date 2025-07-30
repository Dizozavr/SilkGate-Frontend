import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">О нас</h1>
      <p className="text-lg text-gray-300 mb-8 max-w-2xl text-center">SilkGate — это команда экспертов в области стартапов, инвестиций и технологий. Наша миссия — соединять лучшие проекты с лучшими инвесторами и создавать экосистему для роста.</p>
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <div className="bg-[#1A2238] rounded-2xl shadow p-6">
          <div className="text-[#FFD700] font-semibold mb-2">Миссия</div>
          <div className="text-gray-200">Создавать прозрачную, эффективную и безопасную среду для развития инноваций и инвестиций.</div>
        </div>
        <div className="bg-[#1A2238] rounded-2xl shadow p-6">
          <div className="text-[#FFD700] font-semibold mb-2">Команда</div>
          <div className="text-gray-200">Наша команда — это специалисты с опытом в венчурных фондах, IT, юридической поддержке и маркетинге.</div>
        </div>
      </div>
    </div>
  );
} 