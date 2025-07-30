// Коллекция готовых изображений для новостей
// Используем бесплатные изображения с Unsplash (без API ключа)

const newsImages = [
  // Технологии и ИТ (0-4)
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop', // Код на экране
  'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop', // Серверная комната
  'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop', // Микросхемы
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop', // Рабочее место разработчика
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop', // Программирование
  
  // ИИ и машинное обучение (5-9)
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop', // Нейронные сети
  'https://images.unsplash.com/photo-1673187733777-4d8c6c0c8c8c?w=800&h=600&fit=crop', // AI алгоритмы
  'https://images.unsplash.com/photo-1673187733777-4d8c6c0c8c8c?w=800&h=600&fit=crop', // Машинное обучение
  'https://images.unsplash.com/photo-1673187733777-4d8c6c0c8c8c?w=800&h=600&fit=crop', // Робототехника
  'https://images.unsplash.com/photo-1673187733777-4d8c6c0c8c8c?w=800&h=600&fit=crop', // Автоматизация
  
  // Кибербезопасность (10-14)
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop', // Защита данных
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop', // Криптография
  'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=600&fit=crop', // Безопасность сети
  'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=600&fit=crop', // Защита от угроз
  'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=600&fit=crop', // Мониторинг безопасности
  
  // Мобильные технологии (15-19)
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop', // Мобильная разработка
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop', // Смартфоны и планшеты
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop', // Мобильные приложения
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop', // Мобильная связь
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop', // Мобильные устройства
  
  // Веб-разработка (20-24)
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', // Веб-дизайн
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', // Веб-разработка
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', // Фронтенд
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', // Бэкенд
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', // Веб-технологии
  
  // Блокчейн и криптовалюты (25-29)
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop', // Блокчейн
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop', // Криптовалюты
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop', // DeFi
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop', // Смарт-контракты
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop', // NFT
  
  // Облачные технологии (30-34)
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop', // Облачные вычисления
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop', // Серверы
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop', // Дата-центры
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop', // Виртуализация
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop', // Микросервисы
  
  // Стартапы и инновации (35-39)
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', // Стартап команда
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop', // Инновации
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop', // Бизнес технологии
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop', // Технологический стартап
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop', // Инвестиции в технологии
  
  // Квантовые вычисления (40-44)
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop', // Квантовые компьютеры
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop', // Квантовая физика
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop', // Квантовые алгоритмы
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop', // Квантовая криптография
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop', // Квантовые технологии
  
  // Финтех (45-49)
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop', // Финансовые технологии
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop', // Цифровые платежи
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop', // Банковские технологии
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop', // Инвестиционные платформы
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop'  // Финтех инновации
];

// Функция для получения изображения по ID статьи (стабильная привязка)
function getImageByArticleId(articleId) {
  if (!articleId) {
    return newsImages[0]; // fallback
  }
  
  // Создаем более надежный хеш из ID статьи
  let hash = 0;
  for (let i = 0; i < articleId.length; i++) {
    const char = articleId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const index = Math.abs(hash) % newsImages.length;
  return newsImages[index];
}

// Функция для получения изображения по категории и ID статьи
function getImageByCategory(category, articleId = null) {
  const categoryRanges = {
    'technology': [0, 4],
    'ai': [5, 9],
    'cybersecurity': [10, 14],
    'mobile': [15, 19],
    'web': [20, 24],
    'blockchain': [25, 29],
    'cloud': [30, 34],
    'startups': [35, 39],
    'quantum': [40, 44],
    'fintech': [45, 49],
    'other': [0, 49]
  };
  
  const range = categoryRanges[category] || categoryRanges['other'];
  const startIndex = range[0];
  const endIndex = range[1];
  
  // Если есть ID статьи, используем его для стабильной привязки в рамках категории
  if (articleId) {
    let hash = 0;
    for (let i = 0; i < articleId.length; i++) {
      const char = articleId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const index = Math.abs(hash) % (endIndex - startIndex + 1) + startIndex;
    return newsImages[index];
  }
  
  // Иначе возвращаем случайное изображение из категории
  const randomIndex = Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;
  return newsImages[randomIndex];
}

// Функция для получения изображения по индексу (стабильная привязка)
function getImageByIndex(index) {
  return newsImages[index % newsImages.length];
}

// Функция для получения случайного изображения (устаревшая, оставляем для совместимости)
function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * newsImages.length);
  return newsImages[randomIndex];
}

// Функция для получения следующего изображения (устаревшая, оставляем для совместимости)
function getNextUnusedImage() {
  return getRandomImage();
}

// Функция для сброса системы отслеживания (устаревшая, оставляем для совместимости)
function resetImageTracking() {
  console.log('🔄 Система отслеживания изображений больше не используется');
}

// Функция для получения статистики использования (устаревшая, оставляем для совместимости)
function getImageUsageStats() {
  return {
    total: newsImages.length,
    used: 0,
    remaining: newsImages.length,
    usedImages: []
  };
}

module.exports = {
  getRandomImage,
  getImageByCategory,
  getImageByIndex,
  getImageByArticleId,
  getNextUnusedImage,
  resetImageTracking,
  getImageUsageStats,
  newsImages
}; 