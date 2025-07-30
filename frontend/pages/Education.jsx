import React from 'react';

const seminars = [
  {
    id: 1,
    title: 'AI для стартапов',
    date: '15.08.2024',
    desc: 'Практический семинар по внедрению искусственного интеллекта в стартап-проекты.',
    image: '/seminars/ai.jpg',
  },
  {
    id: 2,
    title: 'Венчурные инвестиции 2024',
    date: '28.08.2024',
    desc: 'Актуальные тренды и стратегии привлечения инвестиций.',
    image: '/seminars/vc.jpg',
  },
];

const events = [
  {
    id: 1,
    title: 'Стартап-уикенд',
    date: '05.09.2024',
    desc: 'Интенсив для основателей и инвесторов. Нетворкинг, питчи, разборы кейсов.',
  },
  {
    id: 2,
    title: 'Онлайн-вебинар: Юридические аспекты сделок',
    date: '12.09.2024',
    desc: 'Всё о юридических нюансах инвестирования и стартап-структур.',
  },
];

export default function Education() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Образование</h1>
      <p className="text-lg text-gray-300 mb-10 max-w-2xl">SilkGate организует семинары, вебинары и мероприятия для развития стартапов и инвесторов. Следите за расписанием и присоединяйтесь!</p>

      {/* Семинары */}
      <h2 className="text-2xl font-bold text-white mb-4">Семинары и тренинги</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {seminars.map((s) => (
          <div key={s.id} className="bg-[#1A2238] rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-36 bg-gray-200 flex items-center justify-center">
              <img src={s.image} alt={s.title} className="object-cover w-full h-full" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-[#FFD700] mb-1">{s.title}</h3>
              <div className="text-xs text-gray-400 mb-2">{s.date}</div>
              <p className="text-gray-200 mb-4 flex-1">{s.desc}</p>
              <button className="mt-auto px-4 py-2 rounded-lg bg-[#FFD700] text-[#10182A] font-semibold hover:bg-yellow-400 transition">Подробнее</button>
            </div>
          </div>
        ))}
      </div>

      {/* Календарь событий */}
      <h2 className="text-2xl font-bold text-white mb-4">Календарь событий</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {events.map((e) => (
          <div key={e.id} className="bg-[#232B45] rounded-2xl shadow p-6 flex flex-col">
            <div className="text-lg font-semibold text-[#FFD700] mb-1">{e.title}</div>
            <div className="text-xs text-gray-400 mb-2">{e.date}</div>
            <div className="text-gray-200 mb-3 flex-1">{e.desc}</div>
            <button className="mt-auto px-4 py-2 rounded-lg bg-[#FFD700] text-[#10182A] font-semibold hover:bg-yellow-400 transition self-start">Подробнее</button>
          </div>
        ))}
      </div>
    </div>
  );
} 