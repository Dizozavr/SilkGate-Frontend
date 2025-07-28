import React, { useState } from 'react';
import { useToast } from '../components/Shared/ToastProvider';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('Investor');
  const toast = useToast();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Email обязателен');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Введите корректный email');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userType })
      });
      const data = await res.json();
      if (res.status === 404) {
        setError('Такой email не зарегистрирован');
        toast.showToast('Такой email не зарегистрирован', 'error');
        return;
      }
      if (res.status === 400) {
        setError('Введите корректный email');
        toast.showToast('Введите корректный email', 'error');
        return;
      }
      if (!res.ok) throw new Error(data.message || 'Ошибка');
      toast.showToast('Письмо с инструкцией отправлено (если email зарегистрирован).', 'success');
    } catch (err) {
      setError(err.message || 'Ошибка сервера, попробуйте позже');
      toast.showToast(err.message || 'Ошибка сервера, попробуйте позже', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#10182A]">
      <div className="w-full max-w-md p-8 bg-[#1A2238] rounded-lg shadow text-center">
        <h2 className="text-2xl font-bold mb-6 text-white">
          Восстановление пароля</h2>
        {!status && (
          <form onSubmit={handleSubmit} noValidate>
            <select
              className="w-full mb-4 px-4 py-2 border rounded"
              value={userType}
              onChange={e => setUserType(e.target.value)}
            >
              <option value="Investor">Инвестор</option>
              <option value="StartupUser">Стартапер</option>
            </select>
            <input
              className={`w-full mb-2 px-4 py-2 border rounded ${error ? 'border-red-500' : ''}`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              required
            />
            {error && <div className="text-xs text-red-600 mb-2">{error}</div>}
            <div className="text-xs text-gray-500 mb-2">На этот email придёт ссылка для сброса пароля</div>
            <button className="w-full py-2 bg-[#FFD700] text-[#10182A] rounded font-semibold hover:bg-yellow-400 transition" type="submit" disabled={loading || !!error}>
              {loading ? 'Отправка...' : 'Отправить инструкцию'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 