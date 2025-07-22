import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StartupRegister() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    fundingAmount: '',
    pitchDeckUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.description) {
      setError('Пожалуйста, заполните все обязательные поля.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/startups/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка регистрации');
      setSuccess('Заявка стартапа отправлена!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-gray-50 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Регистрация стартапа</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
        <form onSubmit={handleSubmit}>
          <input className="w-full mb-4 px-4 py-2 border rounded" name="name" value={form.name} onChange={handleChange} type="text" placeholder="Название стартапа*" />
          <input className="w-full mb-4 px-4 py-2 border rounded" name="description" value={form.description} onChange={handleChange} type="text" placeholder="Описание*" />
          <input className="w-full mb-4 px-4 py-2 border rounded" name="industry" value={form.industry} onChange={handleChange} type="text" placeholder="Индустрия" />
          <input className="w-full mb-4 px-4 py-2 border rounded" name="location" value={form.location} onChange={handleChange} type="text" placeholder="Локация" />
          <input className="w-full mb-4 px-4 py-2 border rounded" name="fundingAmount" value={form.fundingAmount} onChange={handleChange} type="number" placeholder="Запрашиваемая сумма" />
          <input className="w-full mb-6 px-4 py-2 border rounded" name="pitchDeckUrl" value={form.pitchDeckUrl} onChange={handleChange} type="url" placeholder="Ссылка на pitch deck" />
          <button className="w-full py-2 bg-black text-white rounded font-semibold hover:bg-gray-900 transition" type="submit" disabled={loading}>
            {loading ? 'Отправка...' : 'Подать заявку'}
          </button>
        </form>
      </div>
    </div>
  );
} 