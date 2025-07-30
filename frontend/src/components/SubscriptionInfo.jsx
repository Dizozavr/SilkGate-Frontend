import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SubscriptionInfo = ({ user, role }) => {
  const [subscription, setSubscription] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscriptionInfo();
  }, [user, role]);

  const fetchSubscriptionInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem(`${role}Token`);
      
      if (!token) {
        setError('Токен не найден');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/subscriptions/current', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении информации о подписке');
      }

      const data = await response.json();
      setSubscription(data.subscription);
      setPlan(data.plan);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isValid, isExpired) => {
    if (isExpired) return 'text-red-500';
    if (isValid) return 'text-green-500';
    return 'text-yellow-500';
  };

  const getStatusText = (isValid, isExpired) => {
    if (isExpired) return 'Истекла';
    if (isValid) return 'Активна';
    return 'Неактивна';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="text-red-500 mb-4">
          <p>Ошибка: {error}</p>
        </div>
        <Link
          to="/pricing"
          className="inline-block bg-[#3B82F6] text-white px-4 py-2 rounded-lg hover:bg-[#2563EB] transition-colors"
        >
          Выбрать план
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-['Playfair_Display'] font-bold text-[#10182A]">
          Подписка
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-['Inter'] font-medium ${getStatusColor(subscription?.is_valid, subscription?.is_expired)}`}>
          {getStatusText(subscription?.is_valid, subscription?.is_expired)}
        </span>
      </div>

      {subscription && plan ? (
        <div className="space-y-4">
          {/* План */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-['Playfair_Display'] font-semibold text-[#10182A]">
                {plan.name}
              </h4>
              <p className="text-gray-600 font-['Inter'] text-sm">
                {plan.price.monthly === 0 ? 'Бесплатный план' : `$${plan.price.monthly}/месяц`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-['Inter']">
                Истекает
              </p>
              <p className="font-['Inter'] font-medium text-[#10182A]">
                {formatDate(subscription.expires_at)}
              </p>
            </div>
          </div>

          {/* Лимиты */}
          <div className="space-y-2">
            <h5 className="font-['Inter'] font-semibold text-[#10182A]">Лимиты плана:</h5>
            <ul className="space-y-1 text-sm font-['Inter']">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#3B82F6] rounded-full mr-2"></span>
                Просмотры проектов: {plan.limits.project_views_per_day === -1 ? 'Неограниченно' : `${plan.limits.project_views_per_day}/день`}
              </li>
              <li className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${plan.limits.startup_contacts_visible ? 'bg-green-500' : 'bg-red-500'}`}></span>
                Контакты стартапов: {plan.limits.startup_contacts_visible ? 'Доступны' : 'Недоступны'}
              </li>
              <li className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${plan.limits.can_export ? 'bg-green-500' : 'bg-red-500'}`}></span>
                Экспорт данных: {plan.limits.can_export ? 'Доступен' : 'Недоступен'}
              </li>
              <li className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${plan.limits.access_private_deals ? 'bg-green-500' : 'bg-red-500'}`}></span>
                Приватные сделки: {plan.limits.access_private_deals ? 'Доступны' : 'Недоступны'}
              </li>
            </ul>
          </div>

          {/* Действия */}
          <div className="flex gap-3 pt-4 border-t">
            {subscription.plan_id !== 'free' && (
              <button
                onClick={() => {/* TODO: Добавить логику отмены */}}
                className="flex-1 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-['Inter']"
              >
                Отменить подписку
              </button>
            )}
            <Link
              to="/pricing"
              className="flex-1 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-center font-['Inter']"
            >
              {subscription.plan_id === 'free' ? 'Выбрать план' : 'Изменить план'}
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 font-['Inter'] mb-4">
            У вас нет активной подписки
          </p>
          <Link
            to="/pricing"
            className="inline-block bg-[#3B82F6] text-white px-6 py-2 rounded-lg hover:bg-[#2563EB] transition-colors font-['Inter']"
          >
            Выбрать план
          </Link>
        </div>
      )}
    </div>
  );
};

export default SubscriptionInfo; 