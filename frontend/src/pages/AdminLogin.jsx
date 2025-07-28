import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json();
      if (!res.ok || data.role !== 'admin') throw new Error('Неверный email или пароль');
      localStorage.setItem('adminToken', data.token);
      window.location.href = '/admin-panel';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#10182A]">
      <div className="w-full max-w-sm p-8 bg-[#F5F6FA] rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#10182A]">
          Вход для администратора
        </h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input className="w-full mb-4 px-4 py-2 border rounded" name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" />
          <div className="flex items-center mb-6 px-4 py-2 border rounded bg-white">
            <input
              className="flex-1 bg-transparent outline-none text-[#10182A]"
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              placeholder="Пароль"
            />
            <button
              type="button"
              tabIndex={-1}
              className="ml-2"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.13 0 2.21.19 3.22.54M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.12 5.12A11.94 11.94 0 0021 12.07M9.88 9.88a3 3 0 014.24 4.24m-9.19-9.19l14.83 14.83" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0c0 3-4 7-10 7S2 15 2 12s4-7 10-7 10 4 10 7z" /></svg>
              )}
            </button>
          </div>
          <button className="w-full py-2 bg-[#FFD700] text-[#10182A] rounded font-semibold hover:bg-yellow-400 transition" type="submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin; 