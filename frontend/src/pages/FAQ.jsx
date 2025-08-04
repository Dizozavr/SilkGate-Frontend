import React, { useState } from 'react';
import Icon from '../components/Shared/Icon';

const faqs = [
  { 
    q: 'Как зарегистрироваться на платформе?', 
    a: 'Нажмите "Войти" и выберите нужную роль. Заполните форму регистрации.',
    icon: 'user'
  },
  { 
    q: 'Как добавить стартап или вакансию?', 
    a: 'После регистрации выберите нужный раздел и следуйте инструкциям.',
    icon: 'add'
  },
  { 
    q: 'Как связаться с поддержкой?', 
    a: 'Используйте форму обратной связи или напишите на support@silkgate.com.',
    icon: 'chat'
  },
  {
    q: 'Безопасны ли мои данные?',
    a: 'Да, мы используем современные методы защиты и не передаём ваши данные третьим лицам.',
    icon: 'security'
  },
  {
    q: 'Как работает система инвестиций?',
    a: 'Платформа предоставляет инструменты для анализа проектов и управления инвестиционным портфелем.',
    icon: 'dashboard'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-[#10182A] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
            FAQ
          </h1>
          <p className="text-lg text-muted font-light max-w-2xl leading-tight">
            Часто задаваемые вопросы о платформе SilkGate.
          </p>
        </div>
        
        {/* FAQ список */}
        <div className="grid gap-6 max-w-3xl">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <button
                className="w-full flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex items-center">
                  <Icon name={faq.icon} size={24} className="mr-3" />
                  <span className="text-lg font-light text-gray-900">{faq.q}</span>
                </div>
                <Icon 
                  name={openIndex === index ? 'minus' : 'add'} 
                  size={20} 
                  className="ml-3 transition-transform"
                />
              </button>
              {openIndex === index && (
                <div className="mt-4 pl-9">
                  <p className="text-gray-600 text-sm font-light leading-tight">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Демо-информация */}
        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-light text-white mb-4">Демо-версия</h3>
          <p className="text-muted text-sm font-light leading-tight">
            Это демо-страница FAQ. В полной версии здесь будет расширенный список вопросов и ответов, 
            а также система поиска по вопросам.
          </p>
        </div>
      </div>
    </div>
  );
} 