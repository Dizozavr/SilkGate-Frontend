import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Shared/ToastProvider';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../components/Shared/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login: authLogin } = useAuth();

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
      console.log('LOGIN: отправка запроса', form);
      const url = 'http://localhost:5000/api/auth/login';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json();
      console.log('LOGIN: ответ от сервера', data);
      if (data.token) {
        try {
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          console.log('JWT payload:', payload);
        } catch (e) { console.log('Ошибка декодирования токена', e); }
      }
      if (!res.ok || !data.role) {
        toast.showToast(data.message || 'Неверный email или пароль', 'error');
        setErrors({ password: 'Неверный email или пароль' });
        return;
      }
      let tokenKey = '';
      let redirect = '/';
      if (data.role === 'investor') {
        tokenKey = 'investorToken';
        redirect = '/investor-dashboard';
      } else if (data.role === 'startup') {
        tokenKey = 'startupToken';
        redirect = '/startup-dashboard';
      } else if (data.role === 'admin') {
        tokenKey = 'adminToken';
        redirect = '/admin-panel';
      } else if (data.role === 'user') {
        tokenKey = 'userToken';
        redirect = '/user-dashboard';
      }
      console.log('LOGIN: сохраняю токен', tokenKey, data.token);
      localStorage.setItem(tokenKey, data.token);
      console.log('LOGIN: localStorage после setItem', {
        investorToken: localStorage.getItem('investorToken'),
        adminToken: localStorage.getItem('adminToken'),
        startupToken: localStorage.getItem('startupToken'),
        userToken: localStorage.getItem('userToken'),
      });
      authLogin({ name: data.name || data.email, email: data.email }, data.token, data.role);
      console.log('LOGIN: вызван authLogin');
      toast.showToast('Вход выполнен успешно', 'success');
      
      // Принудительно обновляем AuthContext
      setTimeout(() => {
        window.location.href = redirect;
      }, 1000);
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
      // Можно отправить user.email, user.displayName на backend или сохранить в localStorage
      window.location.href = '/user-register';
    } catch (error) {
      toast.showToast('Ошибка входа через Google', 'error');
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
            fontFamily:
              '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
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
              <a href="/register" className="text-blue-600 hover:underline">Зарегистрироваться</a>
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
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          <div className="w-full flex flex-col items-center mt-6">
            <a
              href="/forgot-password"
              style={{
                color: '#FFD700',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 400,
                marginBottom: 16,
              }}
            >
              Забыли пароль?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 