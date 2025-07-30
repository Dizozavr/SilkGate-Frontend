import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/news/${id}`);
        if (!response.ok) {
          throw new Error('Новость не найдена');
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10182A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto"></div>
          <p className="mt-4 text-gray-300">Загрузка новости...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-[#10182A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Ошибка</h1>
          <p className="text-gray-300 mb-6">{error || 'Новость не найдена'}</p>
          <button 
            onClick={() => navigate('/news')}
            className="px-6 py-2 bg-[#FFD700] text-[#10182A] rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
          >
            Вернуться к новостям
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10182A]">
      {/* Навигация */}
      <div className="bg-[#1A2238] shadow-sm border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button 
            onClick={() => navigate('/news')}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к новостям
          </button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Заголовок */}
          <div className="p-6 border-b">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {news.title.translated}
            </h1>
            <div className="text-lg text-gray-600 mb-4">
              {news.title.original}
            </div>
            
            {/* Метаданные */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="font-medium">{news.source.name}</span>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {news.category}
                </span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(news.createdAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {news.publishedAt && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Опубликовано: {new Date(news.publishedAt).toLocaleDateString('ru-RU')}
                </div>
              )}
            </div>
          </div>

          {/* Изображение */}
          <div className="relative">
            <img 
              src={`/news/${getImageForNews(news._id)}`}
              alt={news.title.translated}
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>

          {/* Краткое описание */}
          {news.summary && news.summary.translated && (
            <div className="p-6 bg-blue-50 border-b">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Краткое описание</h2>
              <p className="text-gray-700 leading-relaxed">
                {news.summary.translated}
              </p>
            </div>
          )}

          {/* Основной контент */}
          <div className="p-6">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {news.content.translated}
              </div>
            </div>
          </div>

          {/* Теги */}
          {news.tags && news.tags.length > 0 && (
            <div className="px-6 pb-6">
              <div className="flex flex-wrap gap-2">
                {news.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Источник */}
          <div className="px-6 pb-6 border-t pt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Источник</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">{news.source.name}</p>
                  {news.source.logo && (
                    <img 
                      src={news.source.logo} 
                      alt={`Логотип ${news.source.name}`}
                      className="h-6 mt-1"
                    />
                  )}
                </div>
                <a 
                  href={news.source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Читать оригинал
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
} 