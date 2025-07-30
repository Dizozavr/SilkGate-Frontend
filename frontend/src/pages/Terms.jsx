import React from 'react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-['Playfair_Display']">Условия использования</h1>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl font-['Inter']">Пожалуйста, внимательно ознакомьтесь с условиями использования платформы SilkGate.</p>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="space-y-6 font-['Inter'] text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">1. Общие положения</h2>
              <p>Настоящие условия использования регулируют отношения между пользователями и платформой SilkGate. Используя наш сервис, вы соглашаетесь с этими условиями.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">2. Регистрация и аккаунт</h2>
              <p>Для использования всех функций платформы необходимо создать аккаунт. Вы несете ответственность за сохранность своих учетных данных и за все действия, совершенные под вашим аккаунтом.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">3. Правила поведения</h2>
              <p>Запрещается размещать незаконный контент, нарушать права других пользователей, использовать платформу для мошенничества или других противоправных действий.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">4. Интеллектуальная собственность</h2>
              <p>Весь контент на платформе защищен авторским правом. Пользователи сохраняют права на свой контент, но предоставляют платформе право на его использование в рамках сервиса.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">5. Ограничение ответственности</h2>
              <p>SilkGate не несет ответственности за решения, принятые на основе информации, размещенной на платформе. Все инвестиционные решения принимаются на свой страх и риск.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">6. Изменения условий</h2>
              <p>Мы оставляем за собой право изменять эти условия. Пользователи будут уведомлены об изменениях через платформу или по электронной почте.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">7. Контактная информация</h2>
              <p>По всем вопросам, связанным с условиями использования, обращайтесь по адресу: legal@silkgate.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 