import React from 'react';

const news = [
  { id: 1, title: 'SilkGate запускает AI-агента для инвесторов', date: '10.06.2024', desc: 'Теперь подбор проектов стал ещё умнее и быстрее.' },
  { id: 2, title: 'Инвестиции в стартапы выросли на 30%', date: '12.06.2024', desc: 'Аналитика рынка за 2024 год: новые тренды и возможности.' },
];

export default function News() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Блог / Новости</h1>
      <p className="text-lg text-gray-300 mb-10 max-w-2xl">Последние новости и обновления SilkGate.</p>
      <div className="flex flex-col gap-6 max-w-2xl">
        {news.map((n) => (
          <div key={n.id} className="bg-[#1A2238] rounded-2xl shadow p-6">
            <div className="text-[#FFD700] font-semibold mb-2">{n.title}</div>
            <div className="text-xs text-gray-400 mb-2">{n.date}</div>
            <div className="text-gray-200">{n.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 