import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Shared/ToastProvider';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import Navbar from '../components/Navbar';
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
      setTimeout(() => {
        window.location.href = redirect;
        window.location.reload();
      }, 800);
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
        <div className="w-full max-w-xs sm:max-w-md p-4 sm:p-8 bg-[#F5F6FA] rounded-lg shadow">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-[#10182A]">
            Вход в SilkGate
          </h2>
          <form onSubmit={handleSubmit} noValidate>
            <input className={`w-full mb-1 sm:mb-2 px-3 sm:px-4 py-2 border rounded text-sm sm:text-base bg-white text-[#10182A] placeholder-gray-400 ${errors.email ? 'border-red-500' : ''}`} name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" />
            {errors.email && <div className="text-xs text-red-600 mb-2">{errors.email}</div>}
            <div className="text-xs text-gray-500 mb-2">Введите email, указанный при регистрации</div>
            <div className="flex items-center mb-2 sm:mb-4 px-3 sm:px-4 py-2 border rounded bg-white text-sm sm:text-base">
              <input className={`flex-1 bg-transparent outline-none text-[#10182A] ${errors.password ? 'border-red-500' : ''}`} name="password" value={form.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} placeholder="Пароль" />
              <button type="button" tabIndex={-1} className="ml-2" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.13 0 2.21.19 3.22.54M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.12 5.12A11.94 11.94 0 0021 12.07M9.88 9.88a3 3 0 014.24 4.24m-9.19-9.19l14.83 14.83" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0c0 3-4 7-10 7S2 15 2 12s4-7 10-7 10 4 10 7z" /></svg>
                )}
              </button>
            </div>
            {errors.password && <div className="text-xs text-red-600 mb-2">{errors.password}</div>}
            <div className="text-xs text-gray-500 mb-2">Пароль минимум 8 символов</div>
            <button className="w-full py-2 bg-[#FFD700] text-[#10182A] rounded font-semibold hover:bg-yellow-400 transition text-sm sm:text-base" type="submit" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
            {errors.password && <div className="text-xs text-red-600 mt-2 text-center">{errors.password}</div>}
          </form>
          <div className="mt-3 sm:mt-4 text-center">
            <a href="/forgot-password" className="text-[#FFD700] hover:underline text-xs sm:text-sm">
              Забыли пароль?
            </a>
          </div>
          <div className="mt-6 text-center text-sm text-[#10182A]">
            Вы также можете войти через{' '}
            <a href="#" onClick={handleGoogleLogin} className="text-blue-600 hover:underline font-semibold">Google</a>
          </div>
        </div>
      </div>
    </div>
  );
} 