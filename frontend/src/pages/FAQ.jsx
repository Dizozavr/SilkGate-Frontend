import React from 'react';

const faqs = [
  { q: 'Как зарегистрироваться на платформе?', a: 'Нажмите "Войти" и выберите нужную роль. Заполните форму регистрации.' },
  { q: 'Как добавить стартап или вакансию?', a: 'После регистрации выберите нужный раздел и следуйте инструкциям.' },
  { q: 'Как связаться с поддержкой?', a: 'Используйте форму обратной связи или напишите на support@silkgate.com.' },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-['Playfair_Display']">FAQ</h1>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl font-['Inter']">Часто задаваемые вопросы о платформе SilkGate.</p>
        
        <div className="grid gap-6 max-w-3xl">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 font-bold text-lg mb-3 font-['Playfair_Display']">{f.q}</div>
              <div className="text-gray-700 leading-relaxed font-['Inter']">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 