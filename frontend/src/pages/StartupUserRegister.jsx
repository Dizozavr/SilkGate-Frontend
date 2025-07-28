import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Shared/ToastProvider';

export default function StartupUserRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on input change
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name) newErrors.name = 'Имя обязательно';
    if (!form.email) newErrors.email = 'Email обязателен';
    if (!form.password) newErrors.password = 'Пароль обязателен';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/startup-users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка регистрации');
      toast.showToast('Спасибо за регистрацию! Проверьте email для подтверждения.', 'success');
      setTimeout(() => navigate('/startup-login'), 2000);
    } catch (err) {
      toast.showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#10182A] px-2 sm:px-0">
      <div className="w-full max-w-xs sm:max-w-md p-4 sm:p-8 bg-[#F5F6FA] rounded-lg shadow">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-[#10182A]">
          Регистрация стартапера
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <input className={`w-full mb-1 sm:mb-2 px-3 sm:px-4 py-2 border rounded text-sm sm:text-base ${errors.name ? 'border-red-500' : ''}`} name="name" value={form.name} onChange={handleChange} type="text" placeholder="Имя*" />
          {errors.name && <div className="text-xs text-red-600 mb-2">{errors.name}</div>}
          <input className={`w-full mb-1 sm:mb-2 px-3 sm:px-4 py-2 border rounded text-sm sm:text-base ${errors.email ? 'border-red-500' : ''}`} name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email*" />
          {errors.email && <div className="text-xs text-red-600 mb-1">{errors.email}</div>}
          <div className="text-xs text-gray-500 mb-2">Введите действующий email для связи и восстановления доступа</div>
          <div className="flex items-center mb-2 sm:mb-4 px-3 sm:px-4 py-2 border rounded bg-white text-sm sm:text-base">
            <input className={`flex-1 bg-transparent outline-none ${errors.password ? 'border-red-500' : ''}`} name="password" value={form.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} placeholder="Пароль*" />
            <button type="button" tabIndex={-1} className="ml-2" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.13 0 2.21.19 3.22.54M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.12 5.12A11.94 11.94 0 0021 12.07M9.88 9.88a3 3 0 014.24 4.24m-9.19-9.19l14.83 14.83" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0c0 3-4 7-10 7S2 15 2 12s4-7 10-7 10 4 10 7z" /></svg>
              )}
            </button>
          </div>
          {errors.password && <div className="text-xs text-red-600 mb-1">{errors.password}</div>}
          <div className="text-xs text-gray-500 mb-2">Минимум 8 символов, латиница, цифры, спецсимволы</div>
          <button className="w-full py-2 bg-[#FFD700] text-[#10182A] rounded font-semibold hover:bg-yellow-400 transition text-base mt-2" type="submit" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          <div className="mt-6 text-center text-sm text-[#10182A]">
            Или зарегистрируйтесь через{' '}
            <a href="#" onClick={e => { e.preventDefault(); toast.showToast('Google Auth скоро будет доступен', 'info'); }} className="text-blue-600 hover:underline font-semibold">Google</a>
          </div>
        </form>
      </div>
    </div>
  );
} 