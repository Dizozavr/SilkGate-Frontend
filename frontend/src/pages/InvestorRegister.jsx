import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InvestorRegister() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    investmentRange: '',
    interests: '',
    password: '',
    ndaAccepted: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.ndaAccepted) {
      setError('Вы должны принять NDA для регистрации.');
      return;
    }
    if (!form.name || !form.email || !form.password) {
      setError('Пожалуйста, заполните все обязательные поля.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/investors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка регистрации');
      setSuccess('Спасибо за вашу заявку! Мы рассмотрим её и свяжемся с вами по email после личной встречи или собеседования. Доступ к платформе будет открыт только после одобрения администратором.');
      // setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-gray-50 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Регистрация инвестора</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
        {!success && (
        <form onSubmit={handleSubmit}>
          <input className="w-full mb-4 px-4 py-2 border rounded" name="name" value={form.name} onChange={handleChange} type="text" placeholder="Имя*" />
          <input className="w-full mb-4 px-4 py-2 border rounded" name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email*" />
          <input className="w-full mb-4 px-4 py-2 border rounded" name="location" value={form.location} onChange={handleChange} type="text" placeholder="Локация" />
          <input className="w-full mb-4 px-4 py-2 border rounded" name="investmentRange" value={form.investmentRange} onChange={handleChange} type="text" placeholder="Инвестиционный диапазон" />
          <input className="w-full mb-4 px-4 py-2 border rounded" name="interests" value={form.interests} onChange={handleChange} type="text" placeholder="Интересы (через запятую)" />
          <input className="w-full mb-4 px-4 py-2 border rounded" name="password" value={form.password} onChange={handleChange} type="password" placeholder="Пароль*" />
          <label className="flex items-center mb-6">
            <input name="ndaAccepted" type="checkbox" checked={form.ndaAccepted} onChange={handleChange} className="mr-2" /> Я принимаю NDA
          </label>
          <button className="w-full py-2 bg-black text-white rounded font-semibold hover:bg-gray-900 transition" type="submit" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        )}
      </div>
    </div>
  );
} 