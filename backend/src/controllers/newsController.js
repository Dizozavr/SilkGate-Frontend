const News = require('../models/News');
const newsScraperService = require('../services/newsScraperService');

// Сбор новых новостей
exports.scrapeNews = async (req, res) => {
  try {
    console.log('Starting news scraping...');
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
        }
      } catch (error) {
        console.error('Error saving news:', error);
      }
    }

    res.json({ 
      message: `Собрано ${processedNews.length} новостей, сохранено ${savedCount} новых`,
      scraped: processedNews.length,
      saved: savedCount
    });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ message: 'Ошибка при сборе новостей', error: error.message });
  }
};

// Получение одобренных новостей для публичного доступа
exports.getPublishedNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag } = req.query;
    const skip = (page - 1) * limit;

    let query = { status: 'approved' };
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = tag;
    }

    const news = await News.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content.original -title.original -summary.original');

    const total = await News.countDocuments(query);

    res.json({
      news,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении новостей', error: error.message });
  }
};

// Получение всех новостей для админа
exports.getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }

    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await News.countDocuments(query);

    res.json({
      news,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении новостей', error: error.message });
  }
};

// Получение новости по ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    // Увеличиваем счетчик просмотров
    news.views += 1;
    await news.save();

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении новости', error: error.message });
  }
};

// Одобрение новости
exports.approveNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    news.status = 'approved';
    news.publishedAt = new Date();
    news.approvedBy = req.user.email;
    news.approvedAt = new Date();
    
    await news.save();

    res.json({ message: 'Новость одобрена', news });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при одобрении новости', error: error.message });
  }
};

// Отклонение новости
exports.rejectNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    news.status = 'rejected';
    news.approvedBy = req.user.email;
    news.approvedAt = new Date();
    
    await news.save();

    res.json({ message: 'Новость отклонена', news });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при отклонении новости', error: error.message });
  }
};

// Удаление новости
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    res.json({ message: 'Новость удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении новости', error: error.message });
  }
};

// Получение статистики новостей
exports.getNewsStats = async (req, res) => {
  try {
    const stats = await News.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await News.countDocuments();
    const pending = await News.countDocuments({ status: 'pending' });
    const approved = await News.countDocuments({ status: 'approved' });
    const rejected = await News.countDocuments({ status: 'rejected' });

    res.json({
      total,
      pending,
      approved,
      rejected,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении статистики', error: error.message });
  }
}; 