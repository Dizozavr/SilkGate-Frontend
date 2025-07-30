import React, { useState } from 'react';
import { useAuth } from '../Shared/AuthContext';
import { useNavigate } from 'react-router-dom';

const ROLES = [
  { value: 'investor', label: 'Инвестор' },
  { value: 'startup', label: 'Стартапер' },
  { value: 'user', label: 'Пользователь' },
];

export default function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // TODO: Google Auth интеграция
  const handleGoogle = () => {
    alert('Google Auth скоро будет доступен');
  };

  const handleNext = (e) => {
    e && e.preventDefault();
    setError('');
    if (step === 1) {
      if (!email) return;
      setStep(2);
    } else if (step === 2) {
      if (!password || !confirm || password !== confirm) {
        setError('Пароли не совпадают');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!firstName || !lastName) {
        setError('Заполните имя и фамилию');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!role) {
        setError('Выберите роль');
        return;
      }
      setLoading(true);
      
      // Отправляем данные на сервер
      const registerUser = async () => {
        try {
          const name = `${firstName} ${lastName}`;
          let url = '';
          let userData = { name, email, password };
          
          // Выбираем правильный endpoint в зависимости от роли
          if (role === 'user') {
            url = 'http://localhost:5000/api/users/register';
          } else if (role === 'investor') {
            url = 'http://localhost:5000/api/investors/register';
          } else if (role === 'startup') {
            url = 'http://localhost:5000/api/startup-users/register';
          }
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Ошибка регистрации');
          }
          
          // После успешной регистрации автоматически входим
          const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          const loginData = await loginResponse.json();
          
          if (!loginResponse.ok) {
            throw new Error(loginData.message || 'Ошибка входа');
          }
          
          // Сохраняем токен и авторизуем пользователя
          login({ name, email }, loginData.token, loginData.role);
          
          // Определяем редирект в зависимости от роли
          let redirect = '/';
          if (loginData.role === 'investor') {
            redirect = '/investor-dashboard';
          } else if (loginData.role === 'startup') {
            redirect = '/startup-dashboard';
          } else if (loginData.role === 'user') {
            redirect = '/user-dashboard';
          } else if (loginData.role === 'admin') {
            redirect = '/admin-panel';
          }
          
          // Закрываем модальное окно и перенаправляем
          if (onSuccess) onSuccess();
          setTimeout(() => {
            navigate(redirect);
          }, 500);
          
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      
      registerUser();
    }
  };

  const canNext =
    step === 1 ? !!email :
    step === 2 ? !!password && !!confirm && password === confirm :
    step === 3 ? !!firstName && !!lastName :
    step === 4 ? !!role : false;

  return (
    <div
              className="w-full flex flex-col items-center bg-white relative auth-form"
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
      {step > 1 && (
        <button
          type="button"
          className="absolute"
          style={{ left: 32, top: 32, background: 'none', border: 'none', padding: 0, cursor: 'pointer', lineHeight: 1 }}
          onClick={() => setStep(step - 1)}
          aria-label="Назад"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      )}
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
          Уже есть аккаунт?{' '}
          <button className="text-blue-600 hover:underline" type="button" onClick={onSwitchToLogin}>Войти</button>
        </div>
      </div>
      <button
        type="button"
        onClick={handleGoogle}
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
        <img src="/Google__G__logo.svg.png" alt="Google" style={{ height: 20, width: 20 }} /> {step === 4 ? 'Создать через Google' : 'Зарегистрироваться через Google'}
      </button>
      <div className="flex items-center w-full mb-6">
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        <span style={{ margin: '0 16px', color: '#9ca3af', fontSize: 14 }}>или</span>
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
      </div>
      {step === 1 && (
        <form onSubmit={handleNext} className="w-full flex flex-col gap-6">
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
            style={{
              width: '100%',
              borderRadius: 8,
              padding: '12px 16px',
              fontWeight: 500,
              fontSize: '1rem',
              minHeight: 48,
              background: canNext ? '#FFD700' : '#e5e7eb',
              color: canNext ? '#222' : '#888',
              opacity: !canNext || loading ? 0.7 : 1,
              transition: 'all 0.2s',
              border: 'none',
              cursor: !canNext || loading ? 'not-allowed' : 'pointer',
            }}
            disabled={!canNext || loading}
          >
            {loading ? 'Далее...' : 'Далее'}
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleNext} className="w-full flex flex-col gap-6">
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Создайте пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Подтвердите пароль"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
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
              onClick={() => setShowConfirm(v => !v)}
              aria-label="Показать пароль"
            >
              {showConfirm ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#222" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#222" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592m3.31-2.687A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.307 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L6 6" /></svg>
              )}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            style={{
              width: '100%',
              borderRadius: 8,
              padding: '12px 16px',
              fontWeight: 500,
              fontSize: '1rem',
              minHeight: 48,
              background: canNext ? '#FFD700' : '#e5e7eb',
              color: canNext ? '#222' : '#888',
              opacity: !canNext || loading ? 0.7 : 1,
              transition: 'all 0.2s',
              border: 'none',
              cursor: !canNext || loading ? 'not-allowed' : 'pointer',
            }}
            disabled={!canNext || loading}
          >
            {loading ? 'Далее...' : 'Далее'}
          </button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleNext} className="w-full flex flex-col gap-6">
          <input
            type="text"
            placeholder="Имя"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
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
          <input
            type="text"
            placeholder="Фамилия"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
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
            style={{
              width: '100%',
              borderRadius: 8,
              padding: '12px 16px',
              fontWeight: 500,
              fontSize: '1rem',
              minHeight: 48,
              background: canNext ? '#FFD700' : '#e5e7eb',
              color: canNext ? '#222' : '#888',
              opacity: !canNext || loading ? 0.7 : 1,
              transition: 'all 0.2s',
              border: 'none',
              cursor: !canNext || loading ? 'not-allowed' : 'pointer',
            }}
            disabled={!canNext || loading}
          >
            {loading ? 'Далее...' : 'Далее'}
          </button>
        </form>
      )}
      {step === 4 && (
        <form onSubmit={handleNext} className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-3 mb-2">
            {ROLES.map(r => (
              <label key={r.value} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, border: `1.5px solid ${role === r.value ? '#FFD700' : '#d1d5db'}`,
                background: role === r.value ? '#FFFBEA' : '#fff', cursor: 'pointer', fontWeight: 500, fontSize: '1rem', marginBottom: 8
              }}>
                <input type="radio" name="role" value={r.value} checked={role === r.value} onChange={() => setRole(r.value)} style={{ accentColor: '#FFD700', width: 18, height: 18 }} />
                <span>{r.label}</span>
              </label>
            ))}
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            style={{
              width: '100%',
              borderRadius: 8,
              padding: '12px 16px',
              fontWeight: 500,
              fontSize: '1rem',
              minHeight: 48,
              background: canNext ? '#FFD700' : '#e5e7eb',
              color: canNext ? '#222' : '#888',
              opacity: !canNext || loading ? 0.7 : 1,
              transition: 'all 0.2s',
              border: 'none',
              cursor: !canNext || loading ? 'not-allowed' : 'pointer',
            }}
            disabled={!canNext || loading}
          >
            {loading ? 'Создание...' : 'Создать аккаунт'}
          </button>
        </form>
      )}
      <div className="text-xs text-gray-400 text-center mt-6" style={{ fontWeight: 400 }}>
        Регистрируясь, вы соглашаетесь с нашими <a href="/privacy" className="underline hover:text-blue-600">политикой конфиденциальности</a> и <a href="/terms" className="underline hover:text-blue-600">условиями использования</a>.
      </div>
    </div>
  );
} 