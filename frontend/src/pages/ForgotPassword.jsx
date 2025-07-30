import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Shared/ToastProvider';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
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
        body: JSON.stringify({ email, userType: 'Investor' })
      });
      const data = await res.json();
      if (res.status === 404) {
        setError('Такой email не зарегистрирован');
        setSent(false);
        return;
      }
      if (res.status === 400) {
        setError('Введите корректный email');
        setSent(false);
        return;
      }
      if (!res.ok) throw new Error(data.message || 'Ошибка');
      setSent(true);
      toast.showToast('Письмо отправлено! Проверьте почту.', 'success');
    } catch (err) {
      setError(err.message || 'Ошибка сервера, попробуйте позже');
      setSent(false);
      toast.showToast(err.message || 'Ошибка сервера', 'error');
    } finally {
      setLoading(false);
    }
  };

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
            boxShadow: 'none',
          }}
        >
          <button
            type="button"
            className="absolute"
            style={{ left: 32, top: 32, background: 'none', border: 'none', padding: 0, cursor: 'pointer', lineHeight: 1 }}
            onClick={() => navigate('/login')}
            aria-label="Назад"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="w-full flex flex-col items-start mt-2 mb-8" style={{ marginLeft: 0 }}>
            <h2
              className="mb-2"
              style={{
                fontSize: '2rem',
                            fontWeight: 300,
            lineHeight: 1.2,
            letterSpacing: 0,
            color: '#222',
            marginBottom: 8,
            fontFamily: 'Playfair Display, serif',
              }}
            >
              Восстановление пароля
            </h2>
            <div
              className="mb-2"
              style={{
                            color: '#6b7280',
            fontSize: '1rem',
            fontWeight: 300,
            lineHeight: 1.5,
            maxWidth: 340,
              }}
            >
              Введите email, и мы отправим ссылку для сброса пароля.
            </div>
          </div>
          {sent ? (
            <div className="text-green-600 text-center mb-4">Письмо отправлено! Проверьте почту.</div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                }}
                required
              />
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
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
                {loading ? 'Отправка...' : 'Отправить инструкцию'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 