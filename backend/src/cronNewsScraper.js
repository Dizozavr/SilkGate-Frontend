const cron = require('node-cron');
const newsScraperService = require('./services/newsScraperService');
const News = require('./models/News');

// Функция для сбора новостей
async function scrapeNews() {
  try {
    console.log('🔄 Starting scheduled news scraping...');
    const processedNews = await newsScraperService.processAndTranslateNews();
    
    let savedCount = 0;
    for (const newsData of processedNews) {
      try {
        // Проверяем, не существует ли уже такая новость
        const existingNews = await News.findOne({
          'title.original': newsData.title.original,
          'source.url': newsData.source.url
        });

        if (!existingNews) {
          const news = new News(newsData);
          await news.save();
          savedCount++;
          console.log(`✅ Saved: ${newsData.title.translated}`);
        }
      } catch (error) {
        console.error('❌ Error saving news:', error.message);
      }
    }
    
    console.log(`📊 News scraping completed: ${processedNews.length} processed, ${savedCount} saved`);
  } catch (error) {
    console.error('❌ Scheduled news scraping failed:', error.message);
  }
}

// Запускаем cron-задачу каждый день в 9:00 утра
const startNewsCron = () => {
  console.log('⏰ Setting up daily news scraping cron job (9:00 AM)...');
  
  cron.schedule('0 9 * * *', () => {
    scrapeNews();
  }, {
    scheduled: true,
    timezone: "Asia/Almaty" // Время по Алматы
  });
  
  console.log('✅ News scraping cron job scheduled successfully');
};

// Функция для ручного запуска (для тестирования)
const manualScrape = async () => {
  console.log('🔄 Manual news scraping started...');
  await scrapeNews();
};

module.exports = {
  startNewsCron,
  manualScrape,
  scrapeNews
}; 