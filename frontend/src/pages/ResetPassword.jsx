import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-[#10182A] flex flex-col">
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#10182A] px-2 sm:px-0">
        <div
          className="w-full flex flex-col items-center bg-white relative auth-form"
          style={{
            maxWidth: 420,
            minWidth: 320,
            borderRadius: 16,
            padding: '48px 40px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            boxShadow: 'none',
          }}
        >
          <div className="w-full flex flex-col items-start mt-2 mb-8" style={{ marginLeft: 0 }}>
            <h2
              className="mb-2"
              style={{
                fontSize: '2rem',
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: 0,
                color: '#222',
                marginBottom: 8,
              }}
            >
              Сброс пароля
            </h2>
            <div
              className="mb-2"
              style={{
                color: '#6b7280',
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: 1.5,
                maxWidth: 340,
              }}
            >
              Введите новый пароль для вашего аккаунта.
            </div>
          </div>
          {success ? (
            <>
              <div className="text-green-600 text-center mb-6">Пароль успешно изменён!</div>
              <button 
                onClick={() => navigate('/login')}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  padding: '12px 16px',
                  fontWeight: 500,
                  fontSize: '1rem',
                  minHeight: 48,
                  background: '#FFD700',
                  color: '#10182A',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = '#E6C200'}
                onMouseLeave={(e) => e.target.style.background = '#FFD700'}
              >
                Войти
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Новый пароль"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  style={{
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    padding: '12px 16px',
                    fontSize: '1rem',
                    background: '#fff',
                    outline: 'none',
                    width: '100%',
                    minHeight: 48,
                    fontWeight: 400,
                    color: '#222',
                    boxSizing: 'border-box',
                    paddingRight: 44,
                  }}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label="Показать пароль"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#222" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#222" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592m3.31-2.687A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.307 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L6 6" /></svg>
                  )}
                </button>
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <div style={{ color: '#6b7280', fontSize: 14, textAlign: 'center' }}>
                Минимум 8 символов, латиница, цифры, спецсимволы
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  padding: '12px 16px',
                  fontWeight: 500,
                  fontSize: '1rem',
                  minHeight: 48,
                  background: '#FFD700',
                  color: '#10182A',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = '#E6C200'}
                onMouseLeave={(e) => e.target.style.background = '#FFD700'}
              >
                {loading ? 'Сброс...' : 'Сбросить пароль'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 