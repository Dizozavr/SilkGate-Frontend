import React from 'react';

export default function Docs() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-['Playfair_Display']">Документация</h1>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl font-['Inter']">В этом разделе будет размещена техническая и пользовательская документация по платформе SilkGate.</p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-blue-600 font-bold text-xl mb-4 font-['Playfair_Display']">Для пользователей</div>
            <div className="text-gray-700 leading-relaxed mb-6 font-['Inter']">Руководства, инструкции, ответы на вопросы.</div>
            <button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-['Inter']">
              Открыть руководство
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-blue-600 font-bold text-xl mb-4 font-['Playfair_Display']">Для разработчиков</div>
            <div className="text-gray-700 leading-relaxed mb-6 font-['Inter']">API, интеграции, примеры кода.</div>
            <button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-['Inter']">
              Открыть API
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 