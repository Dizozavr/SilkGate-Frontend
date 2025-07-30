import React from 'react';

// Функция для выбора изображения на основе ID семинара
const getImageForSeminar = (seminarId) => {
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
    'fonovyi-kollaz-programmirovania (4).jpg',
    'fonovyi-kollaz-programmirovania (5).jpg',
    'fonovyi-kollaz-programmirovania (6).jpg',
    'fonovyi-kollaz-programmirovania (7).jpg',
    'fonovyi-kollaz-programmirovania (8).jpg',
    'fonovyi-kollaz-programmirovania (9).jpg',
    'fonovyi-kollaz-programmirovania (10).jpg',
    'fonovyi-kollaz-programmirovania (11).jpg',
    'fonovyi-kollaz-programmirovania (12).jpg',
    'fonovyi-kollaz-programmirovania (13).jpg',
    'fonovyi-kollaz-programmirovania (14).jpg',
    'fonovyi-kollaz-programmirovania (15).jpg',
    'fonovyi-kollaz-programmirovania (16).jpg',
    'fonovyi-kollaz-programmirovania (17).jpg',
    'fonovyi-kollaz-programmirovania (18).jpg',
    'fonovyi-kollaz-programmirovania (19).jpg',
    'fonovyi-kollaz-programmirovania (20).jpg',
    'fonovyi-kollaz-programmirovania (21).jpg',
    'krupnym-planom-biznesmen-s-cifrovym-plansetom.jpg'
  ];
  const hash = seminarId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images[hash % images.length];
};

const seminars = [
  {
    id: 1,
    title: 'AI для стартапов',
    date: '15.08.2024',
    desc: 'Практический семинар по внедрению искусственного интеллекта в стартап-проекты.',
  },
  {
    id: 2,
    title: 'Венчурные инвестиции 2024',
    date: '28.08.2024',
    desc: 'Актуальные тренды и стратегии привлечения инвестиций.',
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-['Playfair_Display']">Образование</h1>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl font-['Inter']">SilkGate организует семинары, вебинары и мероприятия для развития стартапов и инвесторов. Следите за расписанием и присоединяйтесь!</p>

        {/* Семинары */}
        <h2 className="text-2xl font-bold text-white mb-6 font-['Playfair_Display']">Семинары и тренинги</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {seminars.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img 
                  src={`/news/${getImageForSeminar(s.id)}`} 
                  alt={s.title} 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-blue-600 mb-2 font-['Playfair_Display']">{s.title}</h3>
                <div className="text-sm text-gray-500 mb-3 font-['Inter']">{s.date}</div>
                <p className="text-gray-700 mb-4 flex-1 font-['Inter'] leading-relaxed">{s.desc}</p>
                <button className="mt-auto px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition font-['Inter']">Подробнее</button>
              </div>
            </div>
          ))}
        </div>

        {/* Календарь событий */}
        <h2 className="text-2xl font-bold text-white mb-6 font-['Playfair_Display']">Календарь событий</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {events.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div className="text-xl font-semibold text-blue-600 mb-2 font-['Playfair_Display']">{e.title}</div>
              <div className="text-sm text-gray-500 mb-3 font-['Inter']">{e.date}</div>
              <div className="text-gray-700 mb-4 flex-1 font-['Inter'] leading-relaxed">{e.desc}</div>
              <button className="mt-auto px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition self-start font-['Inter']">Подробнее</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 