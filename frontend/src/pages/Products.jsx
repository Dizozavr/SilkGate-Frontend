import React from 'react';

// Функция для выбора изображения на основе ID проекта
const getImageForProject = (projectId) => {
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
  
  return images[(projectId - 1) % images.length];
};

// Функция для выбора изображения профиля
const getProfileImage = (profileId) => {
  const profileImages = [
    'biznesmen-derzasii-cifrovoi-ekran-kotoryi-sgeneriroval-globus.jpg',
    'biznesmen-rabotausii-s-planseta-v-ofise-krupnym-planom.jpg',
    'biznesmen-s-kozanym-portfelem.jpg',
    'delovye-ludi-pozimaa-ruki.jpg',
    'krupnym-planom-biznesmen-s-cifrovym-plansetom.jpg'
  ];
  
  return profileImages[(profileId - 1) % profileImages.length];
};

const projects = [
  {
    id: 1,
    title: 'SilkInvest',
    desc: 'Платформа для поиска и анализа стартапов с AI-оценкой рисков.',
    image: `/news/${getImageForProject(1)}`,
  },
  {
    id: 2,
    title: 'GateConnect',
    desc: 'Сервис для безопасного общения и сделок между инвесторами и стартапами.',
    image: `/news/${getImageForProject(2)}`,
  },
  {
    id: 3,
    title: 'DealFlow',
    desc: 'Автоматизация документооборота и подписания NDA онлайн.',
    image: `/news/${getImageForProject(3)}`,
  },
];

const success = [
  {
    id: 1,
    name: 'Алексей Петров',
    text: 'С помощью SilkGate мы нашли инвестора за 2 недели и успешно закрыли раунд!',
    photo: `/news/${getProfileImage(1)}`,
    result: '+$200K инвестиции',
  },
  {
    id: 2,
    name: 'Мария Иванова',
    text: 'Платформа помогла быстро собрать команду и выйти на рынок.',
    photo: `/news/${getProfileImage(2)}`,
    result: 'Запуск за 1 месяц',
  },
];

const partners = [
  { 
    id: 1, 
    name: 'VC Group',
    desc: 'Венчурный капитал',
    initials: 'VC',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  { 
    id: 2, 
    name: 'Startup Hub',
    desc: 'Акселератор',
    initials: 'SH',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  { 
    id: 3, 
    name: 'FinTech Angels',
    desc: 'Ангельские инвесторы',
    initials: 'FA',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  { 
    id: 4, 
    name: 'Tech Ventures',
    desc: 'Технологические инвестиции',
    initials: 'TV',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  { 
    id: 5, 
    name: 'Innovation Lab',
    desc: 'Инновационная лаборатория',
    initials: 'IL',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  { 
    id: 6, 
    name: 'Digital Capital',
    desc: 'Цифровые инвестиции',
    initials: 'DC',
    color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  }
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
            <img src={s.photo} alt={s.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#FFD700] bg-white shadow-lg" />
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {partners.map((p) => (
          <div key={p.id} className="bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-h-[100px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: p.color }}>
              {p.initials}
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-800">{p.name}</div>
              <div className="text-xs text-gray-500">{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 