import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Shared/ToastProvider';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const query = useQuery();
  const token = window.location.pathname.split('/').pop();
  const userType = query.get('type') || 'Investor';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!password) {
      setError('Пароль обязателен');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, userType })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка');
      setSuccess(true);
      toast.showToast('Пароль успешно изменён!', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#10182A] flex flex-col items-center justify-center px-2 sm:px-0">
      <div className="w-full max-w-xs sm:max-w-md p-4 sm:p-8 bg-[#F5F6FA] rounded-lg shadow text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#10182A]">
          Сброс пароля
        </h2>
        {success ? (
          <>
            <div className="text-green-600 text-lg mb-4">Пароль успешно изменён!</div>
            <button className="w-full py-2 bg-[#FFD700] text-[#10182A] rounded font-semibold hover:bg-yellow-400 transition text-sm sm:text-base" onClick={() => navigate('/login')}>Войти</button>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex items-center mb-2 px-4 py-2 border rounded bg-white">
              <input
                className={`flex-1 bg-transparent outline-none text-[#10182A] ${error ? 'border-red-500' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="Новый пароль"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                required
              />
              <button type="button" tabIndex={-1} className="ml-2" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.13 0 2.21.19 3.22.54M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.12 5.12A11.94 11.94 0 0021 12.07M9.88 9.88a3 3 0 014.24 4.24m-9.19-9.19l14.83 14.83" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0c0 3-4 7-10 7S2 15 2 12s4-7 10-7 10 4 10 7z" /></svg>
                )}
              </button>
            </div>
            {error && <div className="text-xs text-red-600 mb-2">{error}</div>}
            <div className="text-xs text-gray-500 mb-2">Минимум 8 символов, латиница, цифры, спецсимволы</div>
            <button className="w-full py-2 bg-[#FFD700] text-[#10182A] rounded font-semibold hover:bg-yellow-400 transition text-sm sm:text-base" type="submit" disabled={loading || !!error}>
              {loading ? 'Сброс...' : 'Сбросить пароль'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 