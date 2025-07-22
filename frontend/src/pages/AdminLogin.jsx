import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      navigate('/admin-panel');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-sm p-8 bg-gray-50 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Вход для администратора</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input className="w-full mb-4 px-4 py-2 border rounded" name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" />
          <input className="w-full mb-6 px-4 py-2 border rounded" name="password" value={form.password} onChange={handleChange} type="password" placeholder="Пароль" />
          <button className="w-full py-2 bg-black text-white rounded font-semibold hover:bg-gray-900 transition" type="submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin; 