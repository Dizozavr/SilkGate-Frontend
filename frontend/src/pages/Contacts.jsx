import React from 'react';

export default function Contacts() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-['Playfair_Display']">Контакты</h1>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl font-['Inter']">Свяжитесь с нами любым удобным способом. Мы всегда готовы помочь!</p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold text-blue-600 mb-4 font-['Playfair_Display']">Общие вопросы</h2>
            <div className="space-y-3 font-['Inter'] text-gray-700">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@silkgate.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+7 (XXX) XXX-XX-XX</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold text-blue-600 mb-4 font-['Playfair_Display']">Техническая поддержка</h2>
            <div className="space-y-3 font-['Inter'] text-gray-700">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@silkgate.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Telegram: @silkgate_support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-blue-600 mb-4 font-['Playfair_Display']">Форма обратной связи</h2>
          <form className="space-y-4 font-['Inter']">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Имя</label>
                <input 
                  type="text" 
                  className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Тема</label>
              <select className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700">
                <option>Общий вопрос</option>
                <option>Техническая поддержка</option>
                <option>Партнерство</option>
                <option>Жалоба</option>
                <option>Другое</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Сообщение</label>
              <textarea 
                className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder-gray-500 min-h-[120px]"
                placeholder="Опишите ваш вопрос или предложение..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Отправить сообщение
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 