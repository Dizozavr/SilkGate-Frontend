import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

export default function News() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/news/published');
        if (response.ok) {
          const data = await response.json();
          setNews(data.news || []);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Блог / Новости</h1>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl">Последние новости и обновления SilkGate.</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Блог / Новости</h1>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl">Последние новости и обновления SilkGate.</p>
        
        {news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Новости пока не опубликованы</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {news.map((item) => (
              <div 
                key={item._id} 
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/news/${item._id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {item.title.translated}
                    </h2>
                    <p className="text-gray-600 mb-3 line-clamp-4">
                      {item.content.translated}
                    </p>
                  </div>
                  <img 
                    src={`/news/${getImageForNews(item._id)}`}
                    alt={item.title.translated}
                    className="w-24 h-24 object-cover rounded-lg ml-4"
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{item.source.name}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {item.category}
                    </span>
                  </div>
                  <span>
                    {new Date(item.publishedAt || item.createdAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 