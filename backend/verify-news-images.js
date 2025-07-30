const mongoose = require('mongoose');
const News = require('./src/models/News');
require('dotenv').config();

async function verifyNewsImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📡 Подключение к MongoDB установлено');
    
    // Общая статистика
    const totalNews = await News.countDocuments();
    const pendingNews = await News.countDocuments({ status: 'pending' });
    const approvedNews = await News.countDocuments({ status: 'approved' });
    
    console.log('\n📊 Общая статистика новостей:');
    console.log(`Всего новостей: ${totalNews}`);
    console.log(`На модерации: ${pendingNews}`);
    console.log(`Одобренных: ${approvedNews}`);
    
    // Проверяем на дубликаты изображений
    const imageCounts = await News.aggregate([
      { $group: { _id: '$image.url', count: { $sum: 1 }, articles: { $push: '$title.translated' } } },
      { $match: { count: { $gt: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    if (imageCounts.length > 0) {
      console.log('\n⚠️  Найдены дублирующиеся изображения:');
      imageCounts.forEach(item => {
        console.log(`${item._id}: ${item.count} раз`);
        item.articles.forEach((title, index) => {
          console.log(`  ${index + 1}. ${title.substring(0, 50)}...`);
        });
      });
    } else {
      console.log('\n✅ Дублирующихся изображений не найдено! Все изображения уникальны.');
    }
    
    // Статистика по категориям
    const categoryStats = await News.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Статистика по категориям:');
    categoryStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} новостей`);
    });
    
    // Показываем несколько примеров новостей с их изображениями
    const sampleNews = await News.find().limit(5).sort({ createdAt: -1 });
    
    console.log('\n📰 Примеры новостей с изображениями:');
    sampleNews.forEach((news, index) => {
      console.log(`${index + 1}. ${news.title.translated.substring(0, 40)}...`);
      console.log(`   Категория: ${news.category}`);
      console.log(`   Статус: ${news.status}`);
      console.log(`   Изображение: ${news.image.url}`);
      console.log('');
    });
    
    console.log('✅ Проверка завершена!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Соединение с MongoDB закрыто');
  }
}

verifyNewsImages(); 