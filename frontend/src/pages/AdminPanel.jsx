import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('adminToken');
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}

export default function AdminPanel() {
  const [tab, setTab] = useState('investors');
  const [investors, setInvestors] = useState([]);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin');
    loadData();
    // eslint-disable-next-line
  }, [tab]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      if (tab === 'investors') {
        const res = await fetchWithAuth('http://localhost:5000/api/admin/investors/pending');
        if (!res.ok) throw new Error('Ошибка загрузки инвесторов');
        setInvestors(await res.json());
      } else {
        const res = await fetchWithAuth('http://localhost:5000/api/admin/startups/pending');
        if (!res.ok) throw new Error('Ошибка загрузки стартапов');
        setStartups(await res.json());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(type, id) {
    setError('');
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/admin/${type}/${id}/approve`, { method: 'POST' });
      if (!res.ok) throw new Error('Ошибка одобрения');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReject(type, id) {
    setError('');
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/admin/${type}/${id}/reject`, { method: 'POST' });
      if (!res.ok) throw new Error('Ошибка отклонения');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Админ-панель SilkGate</h2>
      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => setTab('investors')} className={`px-6 py-2 rounded-lg font-semibold ${tab === 'investors' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>Инвесторы</button>
        <button onClick={() => setTab('startups')} className={`px-6 py-2 rounded-lg font-semibold ${tab === 'startups' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>Стартапы</button>
      </div>
      {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : tab === 'investors' ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Имя</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Локация</th>
                <th className="p-2 border">Интересы</th>
                <th className="p-2 border">Действия</th>
              </tr>
            </thead>
            <tbody>
              {investors.map(inv => (
                <tr key={inv._id} className="border-b">
                  <td className="p-2 border">{inv.name}</td>
                  <td className="p-2 border">{inv.email}</td>
                  <td className="p-2 border">{inv.location}</td>
                  <td className="p-2 border">{(inv.interests || []).join(', ')}</td>
                  <td className="p-2 border flex gap-2">
                    <button onClick={() => handleApprove('investors', inv._id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Одобрить</button>
                    <button onClick={() => handleReject('investors', inv._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Отклонить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Название</th>
                <th className="p-2 border">Описание</th>
                <th className="p-2 border">Индустрия</th>
                <th className="p-2 border">Локация</th>
                <th className="p-2 border">Сумма</th>
                <th className="p-2 border">Действия</th>
              </tr>
            </thead>
            <tbody>
              {startups.map(st => (
                <tr key={st._id} className="border-b">
                  <td className="p-2 border">{st.name}</td>
                  <td className="p-2 border">{st.description}</td>
                  <td className="p-2 border">{st.industry}</td>
                  <td className="p-2 border">{st.location}</td>
                  <td className="p-2 border">{st.fundingAmount}</td>
                  <td className="p-2 border flex gap-2">
                    <button onClick={() => handleApprove('startups', st._id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Одобрить</button>
                    <button onClick={() => handleReject('startups', st._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Отклонить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 