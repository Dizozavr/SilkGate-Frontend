const axios = require('axios');
const cheerio = require('cheerio');
const translationService = require('./translationService');
const { getRandomImage, getImageByCategory } = require('../utils/newsImages');

class NewsScraperService {
  constructor() {
    this.sources = [
      {
        name: 'TechCrunch',
        url: 'https://techcrunch.com',
        logo: 'https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png',
        selectors: {
          articles: 'article, .post-block, .post',
          title: 'h1, h2, h3 a',
          link: 'h1 a, h2 a, h3 a',
          summary: 'p, .excerpt, .summary',
          image: 'img'
        }
      },
      {
        name: 'Ars Technica',
        url: 'https://arstechnica.com',
        logo: 'https://arstechnica.com/favicon.ico',
        selectors: {
          articles: 'article, .listing',
          title: 'h1 a, h2 a, h3 a',
          link: 'h1 a, h2 a, h3 a',
          summary: 'p, .excerpt',
          image: 'img'
        }
      },
      {
        name: 'VentureBeat',
        url: 'https://venturebeat.com',
        logo: 'https://venturebeat.com/favicon.ico',
        selectors: {
          articles: 'article, .ArticleListing',
          title: 'h1 a, h2 a, h3 a',
          link: 'h1 a, h2 a, h3 a',
          summary: 'p, .excerpt',
          image: 'img'
        }
      }
    ];
  }

  async scrapeNews() {
    const allNews = [];
    
    for (const source of this.sources) {
      try {
        console.log(`Scraping ${source.name}...`);
        const sourceNews = await this.scrapeSource(source);
        allNews.push(...sourceNews);
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error.message);
      }
    }
    
    return allNews;
  }

  async scrapeSource(source) {
    try {
      const response = await axios.get(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const articles = [];
      
      $(source.selectors.articles).slice(0, 10).each((i, element) => {
        try {
          const titleElement = $(element).find(source.selectors.title).first();
          const title = titleElement.text().trim();
          const link = titleElement.attr('href');
          
          if (title && link) {
            const summary = $(element).find(source.selectors.summary).first().text().trim();
            const imageElement = $(element).find(source.selectors.image).first();
            const imageUrl = imageElement.attr('src') || imageElement.attr('data-src');
            
            articles.push({
              title,
              summary: summary.substring(0, 200),
              link: link.startsWith('http') ? link : `${source.url}${link}`,
              imageUrl,
              source: source.name
            });
          }
        } catch (error) {
          console.error('Error parsing article:', error.message);
        }
      });
      
      return articles;
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error.message);
      return [];
    }
  }

  async processAndTranslateNews() {
    const scrapedNews = await this.scrapeNews();
    const processedNews = [];
    
    for (const news of scrapedNews) {
      try {
        // Получаем полный контент статьи
        const fullContent = await this.getArticleContent(news.link);
        
        // Определяем категорию и теги
        const { category, tags } = this.categorizeNews(news.title, fullContent);
        
        // Генерируем изображение на основе категории
        const imageUrl = await this.generateImage(news.title, category, news.link);
        
        // Создаем краткое описание через ИИ (первые 2-3 предложения)
        const aiSummary = this.createAISummary(fullContent);
        
        // Переводим контент
        const translatedContent = await translationService.translateNews({
          title: news.title,
          content: aiSummary, // Используем краткое описание вместо полного текста
          summary: aiSummary
        });
        
        processedNews.push({
          ...translatedContent,
          source: {
            name: news.source,
            url: news.link,
            logo: this.sources.find(s => s.name === news.source)?.logo
          },
          image: {
            url: imageUrl,
            alt: news.title
          },
          category,
          tags
        });
        
        // Небольшая задержка между запросами
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error('Error processing news:', error.message);
      }
    }
    
    return processedNews;
  }

  async getArticleContent(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Удаляем ненужные элементы
      $('script, style, nav, header, footer, .advertisement, .ads').remove();
      
      // Извлекаем основной контент
      const content = $('article p, .content p, .post-content p, .entry-content p')
        .map((i, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 50)
        .slice(0, 10)
        .join(' ');
      
      return content || 'Содержание статьи недоступно';
    } catch (error) {
      console.error('Error getting article content:', error.message);
      return 'Содержание статьи недоступно';
    }
  }

  async generateImage(title, category = 'technology', articleId = null) {
    try {
      // Используем стабильную привязку изображений по ID статьи
      const { getImageByArticleId, getImageByCategory } = require('../utils/newsImages');
      
      let imageUrl;
      if (articleId) {
        // Если есть ID статьи, используем стабильную привязку
        imageUrl = getImageByArticleId(articleId);
        console.log(`📸 Использовано изображение для статьи ${articleId}: ${imageUrl}`);
      } else {
        // Иначе используем категорию
        imageUrl = getImageByCategory(category);
        console.log(`📸 Использовано изображение для категории ${category}: ${imageUrl}`);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error getting image:', error.message);
      return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'; // fallback на технологическое изображение
    }
  }

  extractKeywords(title) {
    const keywords = ['technology', 'innovation', 'startup', 'digital'];
    
    if (title.toLowerCase().includes('ai') || title.toLowerCase().includes('artificial intelligence')) {
      keywords.push('artificial intelligence', 'robot', 'automation');
    }
    if (title.toLowerCase().includes('startup') || title.toLowerCase().includes('funding')) {
      keywords.push('business', 'entrepreneur', 'office');
    }
    if (title.toLowerCase().includes('mobile') || title.toLowerCase().includes('app')) {
      keywords.push('mobile', 'smartphone', 'app');
    }
    
    return keywords;
  }

  createAISummary(content) {
    try {
      // Ограничиваем длину контента для перевода (максимум 600 символов)
      let shortContent = content.substring(0, 600);
      
      // Разбиваем на предложения
      const sentences = shortContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
      
      // Берем первые 2-3 предложения для более подробного описания
      const summarySentences = sentences.slice(0, 3);
      
      // Объединяем в краткое описание
      let summary = summarySentences.join('. ').trim();
      
      // Добавляем точку в конце, если её нет
      if (!summary.endsWith('.')) {
        summary += '.';
      }
      
      // Ограничиваем длину (максимум 400 символов)
      if (summary.length > 400) {
        summary = summary.substring(0, 397) + '...';
      }
      
      return summary || 'Краткое описание статьи.';
    } catch (error) {
      console.error('Error creating AI summary:', error);
      return 'Краткое описание статьи.';
    }
  }

  categorizeNews(title, content) {
    const text = (title + ' ' + content).toLowerCase();
    
    let category = 'technology';
    const tags = [];
    
    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning')) {
      category = 'ai';
      tags.push('AI', 'Искусственный интеллект');
    } else if (text.includes('startup') || text.includes('funding') || text.includes('investment')) {
      category = 'startups';
      tags.push('Стартапы', 'Инвестиции');
    } else if (text.includes('cybersecurity') || text.includes('security') || text.includes('hack')) {
      category = 'cybersecurity';
      tags.push('Кибербезопасность');
    } else if (text.includes('mobile') || text.includes('app') || text.includes('ios') || text.includes('android')) {
      category = 'mobile';
      tags.push('Мобильные технологии');
    } else if (text.includes('web') || text.includes('internet') || text.includes('online')) {
      category = 'web';
      tags.push('Веб-технологии');
    }
    
    return { category, tags };
  }
}

module.exports = new NewsScraperService(); 