import React from 'react';

const projects = [
  {
    id: 1,
    title: 'SilkInvest',
    desc: 'Платформа для поиска и анализа стартапов с AI-оценкой рисков.',
    image: '/projects/invest.jpg',
  },
  {
    id: 2,
    title: 'GateConnect',
    desc: 'Сервис для безопасного общения и сделок между инвесторами и стартапами.',
    image: '/projects/connect.jpg',
  },
  {
    id: 3,
    title: 'DealFlow',
    desc: 'Автоматизация документооборота и подписания NDA онлайн.',
    image: '/projects/dealflow.jpg',
  },
];

const success = [
  {
    id: 1,
    name: 'Алексей Петров',
    text: 'С помощью SilkGate мы нашли инвестора за 2 недели и успешно закрыли раунд!',
    photo: '/success/alexey.jpg',
    result: '+$200K инвестиции',
  },
  {
    id: 2,
    name: 'Мария Иванова',
    text: 'Платформа помогла быстро собрать команду и выйти на рынок.',
    photo: '/success/maria.jpg',
    result: 'Запуск за 1 месяц',
  },
];

const partners = [
  { id: 1, logo: '/partners/partner1.png', name: 'VC Group' },
  { id: 2, logo: '/partners/partner2.png', name: 'Startup Hub' },
  { id: 3, logo: '/partners/partner3.png', name: 'FinTech Angels' },
];

export default function Products() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Наши продукты</h1>
      <p className="text-lg text-gray-300 mb-10 max-w-2xl">SilkGate — это экосистема сервисов для стартапов и инвесторов. Мы объединяем лучшие решения для поиска, анализа и сопровождения сделок.</p>

      {/* Витрина проектов */}
      <h2 className="text-2xl font-bold text-white mb-4">Витрина проектов</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {projects.map((p) => (
          <div key={p.id} className="bg-[#1A2238] rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="h-40 bg-gray-200 flex items-center justify-center">
              <img src={p.image} alt={p.title} className="object-cover w-full h-full" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">{p.title}</h3>
              <p className="text-gray-200 mb-4 flex-1">{p.desc}</p>
              <button className="mt-auto px-4 py-2 rounded-lg bg-[#FFD700] text-[#10182A] font-semibold hover:bg-yellow-400 transition">Подробнее</button>
            </div>
          </div>
        ))}
      </div>

      {/* Истории успеха */}
      <h2 className="text-2xl font-bold text-white mb-4">Истории успеха</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {success.map((s) => (
          <div key={s.id} className="bg-[#232B45] rounded-2xl shadow p-6 flex gap-4 items-center">
            <img src={s.photo} alt={s.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#FFD700] bg-white" />
            <div>
              <div className="text-white font-semibold">{s.name}</div>
              <div className="text-gray-300 text-sm mb-1">{s.text}</div>
              <div className="text-[#FFD700] text-xs font-bold">{s.result}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Партнёры */}
      <h2 className="text-2xl font-bold text-white mb-4">Партнёры</h2>
      <div className="flex flex-wrap gap-8 items-center">
        {partners.map((p) => (
          <div key={p.id} className="bg-white rounded-xl p-3 flex items-center justify-center shadow min-w-[120px] min-h-[60px]">
            <img src={p.logo} alt={p.name} className="h-10 object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
} 