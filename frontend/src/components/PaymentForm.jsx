import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentForm = ({ plan, period, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('demo');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const navigate = useNavigate();

  const getPrice = () => {
    return period === 'yearly' ? plan.price.yearly : plan.price.monthly;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Получаем токен пользователя
      const token = localStorage.getItem('investorToken') || 
                   localStorage.getItem('userToken') || 
                   localStorage.getItem('startupToken');

      if (!token) {
        alert('Необходимо войти в систему');
        navigate('/login');
        return;
      }

      // Определяем роль пользователя
      let role = 'user';
      if (localStorage.getItem('investorToken')) role = 'investor';
      else if (localStorage.getItem('startupToken')) role = 'startup';

      // Отправляем запрос на создание подписки
      const response = await fetch('http://localhost:5000/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId: plan.id,
          period: period,
          paymentMethod: paymentMethod
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании подписки');
      }

      const result = await response.json();
      
      // Показываем успешное сообщение
      alert(`Подписка ${plan.name} успешно создана! Спасибо за доверие.`);
      
      if (onSuccess) {
        onSuccess(result);
      } else {
        navigate('/profile');
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-['Playfair_Display'] font-bold text-[#10182A] mb-2">
          Оформление подписки
        </h3>
        <p className="text-gray-600 font-['Inter']">
          {plan.name} • {period === 'yearly' ? 'Годовая' : 'Месячная'} подписка
        </p>
        <div className="text-2xl font-['Playfair_Display'] font-bold text-[#3B82F6] mt-2">
          ${getPrice()}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Способ оплаты */}
        <div>
          <label className="block text-sm font-['Inter'] font-medium text-[#10182A] mb-2">
            Способ оплаты
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="demo"
                checked={paymentMethod === 'demo'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <span className="font-['Inter'] text-sm">Демо-оплата (для тестирования)</span>
            </label>
            <label className="flex items-center opacity-50">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
                disabled
              />
              <span className="font-['Inter'] text-sm">Кредитная карта (скоро)</span>
            </label>
            <label className="flex items-center opacity-50">
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
                disabled
              />
              <span className="font-['Inter'] text-sm">PayPal (скоро)</span>
            </label>
          </div>
        </div>

        {/* Демо-информация */}
        {paymentMethod === 'demo' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-['Inter'] font-semibold text-blue-800 mb-2">
              🎯 Демо-режим
            </h4>
            <p className="text-blue-700 font-['Inter'] text-sm">
              Это демо-версия системы подписок. В реальном приложении здесь будет интеграция с платежными системами.
            </p>
          </div>
        )}

        {/* Форма карты (скрыта в демо-режиме) */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-['Inter'] font-medium text-[#10182A] mb-2">
                Номер карты
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] font-['Inter']"
                disabled
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-['Inter'] font-medium text-[#10182A] mb-2">
                  Срок действия
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] font-['Inter']"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-['Inter'] font-medium text-[#10182A] mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] font-['Inter']"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-['Inter'] font-medium text-[#10182A] mb-2">
                Имя держателя карты
              </label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="IVAN IVANOV"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] font-['Inter']"
                disabled
              />
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-['Inter']"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors font-['Inter'] disabled:opacity-50"
          >
            {loading ? 'Обработка...' : `Оплатить $${getPrice()}`}
          </button>
        </div>
      </form>

      {/* Информация о безопасности */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 font-['Inter']">
          🔒 Ваши данные защищены SSL-шифрованием
        </p>
      </div>
    </div>
  );
};

export default PaymentForm; 