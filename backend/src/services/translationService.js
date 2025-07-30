const axios = require('axios');

class TranslationService {
  constructor() {
    // Используем бесплатный API для перевода
    this.apiUrl = 'https://api.mymemory.translated.net/get';
  }

  async translateText(text, fromLang = 'en', toLang = 'ru') {
    try {
      if (!text || text.trim().length === 0) {
        return text;
      }

      // Ограничиваем длину текста для перевода (максимум 800 символов)
      const textToTranslate = text.length > 800 ? text.substring(0, 800) + '...' : text;

      const response = await axios.get(this.apiUrl, {
        params: {
          q: textToTranslate,
          langpair: `${fromLang}|${toLang}`
        },
        timeout: 10000
      });

      if (response.data && response.data.responseData) {
        return response.data.responseData.translatedText;
      } else {
        console.error('Translation API error:', response.data);
        return text; // возвращаем оригинал если перевод не удался
      }
    } catch (error) {
      console.error('Translation error:', error.message);
      return text; // возвращаем оригинал при ошибке
    }
  }

  async translateNews(newsData) {
    try {
      const [translatedTitle, translatedContent, translatedSummary] = await Promise.all([
        this.translateText(newsData.title),
        this.translateText(newsData.content),
        newsData.summary ? this.translateText(newsData.summary) : null
      ]);

      return {
        title: {
          original: newsData.title,
          translated: translatedTitle
        },
        content: {
          original: newsData.content,
          translated: translatedContent
        },
        summary: newsData.summary ? {
          original: newsData.summary,
          translated: translatedSummary
        } : null
      };
    } catch (error) {
      console.error('News translation error:', error);
      throw error;
    }
  }
}

module.exports = new TranslationService(); 