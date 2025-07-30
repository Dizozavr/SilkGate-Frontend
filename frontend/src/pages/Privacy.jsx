import React from 'react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-['Playfair_Display']">Политика конфиденциальности</h1>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl font-['Inter']">Мы заботимся о защите ваших персональных данных и соблюдаем все требования законодательства.</p>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="space-y-6 font-['Inter'] text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">1. Сбор информации</h2>
              <p>Мы собираем только ту информацию, которая необходима для предоставления наших услуг: имя, email, телефон, информация о компании и проектах.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">2. Использование данных</h2>
              <p>Ваши данные используются для: создания аккаунта, связи с вами, улучшения сервиса, отправки уведомлений о важных событиях.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">3. Защита данных</h2>
              <p>Мы используем современные методы шифрования и защиты данных. Ваша информация хранится на защищенных серверах и не передается третьим лицам без вашего согласия.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">4. Cookies и аналитика</h2>
              <p>Мы используем cookies для улучшения работы сайта и аналитики. Вы можете отключить cookies в настройках браузера, но это может повлиять на функциональность.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">5. Права пользователей</h2>
              <p>Вы имеете право: получить доступ к своим данным, исправить неточную информацию, удалить аккаунт, отозвать согласие на обработку данных.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">6. Передача данных</h2>
              <p>Мы не продаем и не передаем ваши персональные данные третьим лицам, кроме случаев, предусмотренных законом или с вашего явного согласия.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">7. Изменения политики</h2>
              <p>Мы можем обновлять эту политику. О значительных изменениях вы будете уведомлены по email или через платформу.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-600 mb-3 font-['Playfair_Display']">8. Контакты</h2>
              <p>По вопросам конфиденциальности обращайтесь: privacy@silkgate.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 