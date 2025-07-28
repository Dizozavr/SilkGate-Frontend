import React, { useState } from 'react';
import { useToast } from '../Shared/ToastProvider';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';

export default function LoginForm({ onForgot, onRegister, onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email обязателен';
    if (!form.password) newErrors.password = 'Пароль обязателен';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.showToast('Заполните email и пароль', 'error');
      return;
    }
    setLoading(true);
    try {
      const url = 'http://localhost:5000/api/auth/login';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json();
      if (!res.ok || !data.role) {
        toast.showToast(data.message || 'Неверный email или пароль', 'error');
        setErrors({ password: 'Неверный email или пароль' });
        return;
      }
      let tokenKey = '';
      if (data.role === 'investor') tokenKey = 'investorToken';
      else if (data.role === 'startup') tokenKey = 'startupToken';
      else if (data.role === 'admin') tokenKey = 'adminToken';
      else if (data.role === 'user') tokenKey = 'userToken';
      localStorage.setItem(tokenKey, data.token);
      toast.showToast('Вход выполнен успешно', 'success');
      if (onSuccess) onSuccess(data.role);
    } catch (err) {
      toast.showToast(err.message || 'Ошибка входа', 'error');
      setErrors({ password: err.message || 'Ошибка входа' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (onSuccess) onSuccess('user');
    } catch (error) {
      toast.showToast('Ошибка входа через Google', 'error');
    }
  };

  return (
    <div
      className="w-full flex flex-col items-center bg-white relative"
      style={{
        maxWidth: 420,
        minWidth: 320,
        borderRadius: 16,
        padding: '48px 40px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
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
          Добро пожаловать!
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
          Нет аккаунта?{' '}
          <button className="text-blue-600 hover:underline" type="button" onClick={onRegister}>Зарегистрироваться</button>
        </div>
      </div>
      <button
        type="button"
        onClick={handleGoogleLogin}
        style={{
          width: '100%',
          borderRadius: 8,
          padding: '12px 16px',
          fontWeight: 500,
          fontSize: '1rem',
          minHeight: 48,
          background: '#000',
          color: '#fff',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <img src="/Google__G__logo.svg.png" alt="Google" style={{ height: 20, width: 20 }} /> Войти через Google
      </button>
      <div className="flex items-center w-full mb-6">
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        <span style={{ margin: '0 16px', color: '#9ca3af', fontSize: 14 }}>или</span>
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
      </div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
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
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
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
        {errors.email && <div className="text-red-500 text-sm text-center">{errors.email}</div>}
        {errors.password && <div className="text-red-500 text-sm text-center">{errors.password}</div>}
        <div className="flex justify-end mb-2">
          <button type="button" className="text-sm text-blue-600 hover:underline" style={{ fontWeight: 500 }} onClick={onForgot}>Забыли пароль?</button>
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            borderRadius: 8,
            padding: '12px 16px',
            fontWeight: 500,
            fontSize: '1rem',
            minHeight: 48,
            background: form.email && form.password ? '#FFD700' : '#e5e7eb',
            color: form.email && form.password ? '#222' : '#888',
            opacity: !form.email || !form.password || loading ? 0.7 : 1,
            transition: 'all 0.2s',
            border: 'none',
            cursor: !form.email || !form.password || loading ? 'not-allowed' : 'pointer',
          }}
          disabled={!form.email || !form.password || loading}
        >
          {loading ? 'Вход...' : 'Далее'}
        </button>
      </form>
      <div className="text-xs text-gray-400 text-center mt-6" style={{ fontWeight: 400 }}>
        Входя, вы соглашаетесь с нашими <a href="/privacy" className="underline hover:text-blue-600">политикой конфиденциальности</a> и <a href="/terms" className="underline hover:text-blue-600">условиями использования</a>.
      </div>
    </div>
  );
} 