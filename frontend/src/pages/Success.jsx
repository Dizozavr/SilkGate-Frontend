import React from 'react';

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

export default function Success() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Истории успеха</h1>
      <p className="text-lg text-gray-300 mb-10 max-w-2xl">Реальные кейсы и отзывы пользователей SilkGate. Мы гордимся успехами наших клиентов!</p>
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
    </div>
  );
} 