import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NewsSlider from '../components/NewsSlider'; // Подключаем реальный компонент

const FAQS = [
  { q: 'Что такое SilkGate?', a: 'SilkGate — это платформа для стартапов и инвесторов, объединяющая лучшие проекты и капитал.' },
  { q: 'Как зарегистрироваться?', a: 'Нажмите “Войти” и выберите “Зарегистрируйтесь бесплатно” в форме.' },
  { q: 'Кто может стать инвестором?', a: 'Любой желающий, прошедший модерацию и одобренный администратором.' },
  { q: 'Как добавить стартап?', a: 'После регистрации выберите роль “Стартап” и заполните профиль.' },
  { q: 'Безопасны ли мои данные?', a: 'Да, мы используем современные методы защиты и не передаём ваши данные третьим лицам.' },
];

function FAQAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-8 px-8">
      <h2 className="mb-6 text-2xl md:text-3xl font-bold text-white text-left" style={{ fontFamily: 'Playfair Display, serif' }}>FAQ</h2>
      {FAQS.map((item, idx) => (
        <div key={idx} className="border-b border-gray-700 py-2">
          <button
            className="w-full flex justify-between items-center focus:outline-none text-base md:text-lg text-white font-bold text-left mb-1"
            style={{ fontFamily: 'Playfair Display, serif' }}
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <span>{item.q}</span>
            <span className="ml-2">
              {open === idx ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              )}
            </span>
          </button>
          {open === idx && (
            <div className="pt-1 text-sm md:text-base text-gray-300 text-left" style={{ fontFamily: 'Inter, Arial, sans-serif', lineHeight: 1.3 }}>{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#10182A] flex flex-col items-center">
      {/* Hero-блок */}
      <div className="flex flex-col items-center mt-20 mb-14 w-full">
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-2 leading-[1.1] text-white text-center mx-auto"
          style={{ fontFamily: 'Playfair Display, serif', maxWidth: '900px' }}
        >
          SilkGate — платформа для стартапов<br />и инвесторов
        </h1>
        <p
          className="text-[#bdbdbd] text-lg md:text-xl font-normal leading-normal text-center max-w-xl mx-auto"
          style={{ fontFamily: 'Inter, Arial, sans-serif' }}
        >
          Соединяем перспективные стартапы с проверенными инвесторами под полной конфиденциальностью.
        </p>
      </div>
      {/* Новости */}
      <div className="w-full flex justify-center mb-16">
        <div className="w-full max-w-4xl">
          <NewsSlider />
        </div>
      </div>
      {/* FAQ */}
      <div className="w-full flex justify-center mb-20">
        <div className="w-full max-w-2xl">
          <FAQAccordion />
        </div>
      </div>
    </div>
  );
} 