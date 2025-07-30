import React from 'react';

export default function HRPartner() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-['Playfair_Display']">HR-партнёрство</h1>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl font-['Inter']">Хотите стать HR-партнёром SilkGate? Оставьте заявку — мы расскажем о возможностях сотрудничества.</p>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">Компания</label>
              <input 
                className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all font-['Inter']" 
                placeholder="Название вашей компании" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">Контактный email или телефон</label>
              <input 
                className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all font-['Inter']" 
                placeholder="example@company.com или +7 (999) 123-45-67" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">Комментарий</label>
              <textarea 
                className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all min-h-[100px] resize-none font-['Inter']" 
                placeholder="Расскажите о ваших потребностях в HR-услугах..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="mt-4 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-['Inter']"
            >
              Отправить заявку
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 