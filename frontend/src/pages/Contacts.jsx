import React from 'react';
import Icon from '../components/Shared/Icon';

export default function Contacts() {
  return (
    <div className="min-h-screen bg-[#10182A] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
            Контакты
          </h1>
          <p className="text-lg text-muted font-light max-w-2xl leading-tight">
            Свяжитесь с нами любым удобным способом. Мы всегда готовы помочь и ответить на ваши вопросы.
          </p>
        </div>
        
        {/* Основные контакты */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <Icon name="email" size={32} className="mr-4" />
              <h2 className="text-xl font-light text-gray-900">Email</h2>
            </div>
            <p className="text-gray-600 text-sm font-light leading-tight mb-4">
              Напишите нам на почту для получения подробной информации
            </p>
            <a 
              href="mailto:info@silkgate.com" 
              className="text-blue-600 text-sm font-light hover:underline"
            >
              info@silkgate.com
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <Icon name="phone" size={32} className="mr-4" />
              <h2 className="text-xl font-light text-gray-900">Телефон</h2>
            </div>
            <p className="text-gray-600 text-sm font-light leading-tight mb-4">
              Позвоните нам для быстрого решения вопросов
            </p>
            <a 
              href="tel:+74951234567" 
              className="text-blue-600 text-sm font-light hover:underline"
            >
              +7 (495) 123-45-67
            </a>
          </div>
        </div>
        
        {/* Форма обратной связи */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-xl font-light text-gray-900 mb-6">Форма обратной связи</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-light"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-light"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                Тема
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-light"
                placeholder="Тема сообщения"
              />
            </div>
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                Сообщение
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-light"
                placeholder="Ваше сообщение..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-light"
            >
              Отправить сообщение
            </button>
          </form>
        </div>
        
        {/* Дополнительная информация */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Icon name="location" size={24} className="mr-3" />
              <h3 className="text-lg font-light text-gray-900">Адрес</h3>
            </div>
            <p className="text-gray-600 text-sm font-light leading-tight">
              Москва, ул. Примерная, д. 123<br />
              Бизнес-центр "Инновации"
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Icon name="time" size={24} className="mr-3" />
              <h3 className="text-lg font-light text-gray-900">Время работы</h3>
            </div>
            <p className="text-gray-600 text-sm font-light leading-tight">
              Пн-Пт: 9:00 - 18:00<br />
              Сб-Вс: Выходной
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Icon name="chat" size={24} className="mr-3" />
              <h3 className="text-lg font-light text-gray-900">Поддержка</h3>
            </div>
            <p className="text-gray-600 text-sm font-light leading-tight">
              Онлайн чат доступен<br />
              24/7 для клиентов
            </p>
          </div>
        </div>
        
        {/* Демо-информация */}
        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-light text-white mb-4">Демо-версия</h3>
          <p className="text-muted text-sm font-light leading-tight">
            Это демо-страница контактов. В полной версии здесь будет рабочая форма обратной связи, 
            реальные контактные данные и интеграция с системой поддержки.
          </p>
        </div>
      </div>
    </div>
  );
} 