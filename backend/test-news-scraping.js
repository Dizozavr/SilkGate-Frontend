const mongoose = require('mongoose');
const newsScraperService = require('./src/services/newsScraperService');
const News = require('./src/models/News');
require('dotenv').config();

async function testNewsScraping() {
  try {
    // Подключаемся к MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Тестируем сбор новостей
    console.log('🔄 Starting news scraping test...');
    const processedNews = await newsScraperService.processAndTranslateNews();
    
    console.log(`📊 Found ${processedNews.length} news articles`);
    
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
        } else {
          console.log(`⏭️  Skipped (already exists): ${newsData.title.translated}`);
        }
      } catch (error) {
        console.error('❌ Error saving news:', error.message);
      }
    }

    console.log(`🎉 Test completed: ${processedNews.length} processed, ${savedCount} saved`);

    // Показываем статистику
    const totalNews = await News.countDocuments();
    const pendingNews = await News.countDocuments({ status: 'pending' });
    const approvedNews = await News.countDocuments({ status: 'approved' });

    console.log('\n📈 News Statistics:');
    console.log(`Total news: ${totalNews}`);
    console.log(`Pending: ${pendingNews}`);
    console.log(`Approved: ${approvedNews}`);

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Запускаем тест
testNewsScraping(); 