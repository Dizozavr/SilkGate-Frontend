import React from 'react';

const faqs = [
  { q: 'Как зарегистрироваться на платформе?', a: 'Нажмите “Войти” и выберите нужную роль. Заполните форму регистрации.' },
  { q: 'Как добавить стартап или вакансию?', a: 'После регистрации выберите нужный раздел и следуйте инструкциям.' },
  { q: 'Как связаться с поддержкой?', a: 'Используйте форму обратной связи или напишите на support@silkgate.com.' },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">FAQ</h1>
      <p className="text-lg text-gray-300 mb-10 max-w-2xl">Часто задаваемые вопросы о платформе SilkGate.</p>
      <div className="flex flex-col gap-6 max-w-2xl">
        {faqs.map((f, i) => (
          <div key={i} className="bg-[#1A2238] rounded-2xl shadow p-6">
            <div className="text-[#FFD700] font-semibold mb-2">{f.q}</div>
            <div className="text-gray-200">{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 