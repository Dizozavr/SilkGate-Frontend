import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl">×</button>
        {children}
      </div>
    </div>
  );
}

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
  const [allInvestors, setAllInvestors] = useState([]);
  const [startups, setStartups] = useState([]);
  const [allStartups, setAllStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [startupSearch, setStartupSearch] = useState('');
  const [modalStartup, setModalStartup] = useState(null);

  // Фильтры для стартапов
  const [startupIndustry, setStartupIndustry] = useState('');
  const [startupLocation, setStartupLocation] = useState('');
  const [startupName, setStartupName] = useState('');
  // Фильтры для инвесторов
  const [investorName, setInvestorName] = useState('');
  const [investorLocation, setInvestorLocation] = useState('');
  const [investorInterest, setInvestorInterest] = useState('');

  // Уникальные значения для фильтров
  const startupIndustries = Array.from(new Set(allStartups.map(st => st.industry).filter(Boolean)));
  const investorInterests = Array.from(new Set(allInvestors.flatMap(inv => inv.interests || []).filter(Boolean)));

  // Фильтрация стартапов
  const filteredStartups = allStartups.filter(st =>
    (!startupIndustry || st.industry === startupIndustry) &&
    (!startupLocation || (st.location || '').toLowerCase().includes(startupLocation.toLowerCase())) &&
    (!startupName || (st.name || '').toLowerCase().includes(startupName.toLowerCase()))
  );
  // Фильтрация инвесторов
  const filteredInvestors = allInvestors.filter(inv =>
    (!investorName || (inv.name || '').toLowerCase().includes(investorName.toLowerCase())) &&
    (!investorLocation || (inv.location || '').toLowerCase().includes(investorLocation.toLowerCase())) &&
    (!investorInterest || (inv.interests || []).includes(investorInterest))
  );

  const fetchInvestors = async () => {
    setLoading(true);
    const res = await fetchWithAuth('http://localhost:5000/api/admin/investors/pending');
    if (!res.ok) throw new Error('Ошибка загрузки инвесторов');
    const data = await res.json();
    setInvestors(data);
    setLoading(false);
  };

  const fetchAllInvestors = async () => {
    setLoading(true);
    const res = await fetchWithAuth('http://localhost:5000/api/admin/investors/all');
    if (!res.ok) throw new Error('Ошибка загрузки инвесторов');
    const data = await res.json();
    setAllInvestors(data);
    setLoading(false);
  };

  const fetchAllStartups = async () => {
    setLoading(true);
    const res = await fetchWithAuth('http://localhost:5000/api/admin/startups/all');
    if (!res.ok) throw new Error('Ошибка загрузки стартапов');
    const data = await res.json();
    setAllStartups(data);
    setLoading(false);
  };

  const fetchStartups = async () => {
    setLoading(true);
    const res = await fetchWithAuth('http://localhost:5000/api/admin/startups/pending');
    if (!res.ok) throw new Error('Ошибка загрузки стартапов');
    const data = await res.json();
    setStartups(data);
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin');
    if (tab === 'investors') fetchInvestors();
    if (tab === 'all') fetchAllInvestors();
    if (tab === 'startups') fetchStartups();
    if (tab === 'allStartups') fetchAllStartups();
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
      } else if (tab === 'all') {
        const res = await fetchWithAuth('http://localhost:5000/api/admin/investors/all');
        if (!res.ok) throw new Error('Ошибка загрузки инвесторов');
        setAllInvestors(await res.json());
      } else if (tab === 'startups') {
        const res = await fetchWithAuth('http://localhost:5000/api/admin/startups/pending');
        if (!res.ok) throw new Error('Ошибка загрузки стартапов');
        setStartups(await res.json());
      } else if (tab === 'allStartups') {
        const res = await fetchWithAuth('http://localhost:5000/api/admin/startups/all');
        if (!res.ok) throw new Error('Ошибка загрузки стартапов');
        setAllStartups(await res.json());
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

  // Экспорт в CSV
  function exportStartupsToCSV() {
    const headers = [
      'Название', 'Описание', 'Индустрия', 'Локация', 'Сумма', 'Pitch Deck', 'Имя владельца', 'Email владельца', 'Статус'
    ];
    const rows = filteredStartups.map(st => [
      st.name,
      st.description,
      st.industry,
      st.location,
      st.fundingAmount,
      st.pitchDeckUrl || '',
      st.startupUserId?.name || '',
      st.startupUserId?.email || '',
      st.status
    ]);
    const csv = [headers, ...rows].map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'startups.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Экспорт инвесторов в CSV
  function exportInvestorsToCSV() {
    const headers = [
      'Имя', 'Email', 'Локация', 'Интересы', 'Статус'
    ];
    const rows = filteredInvestors.map(inv => [
      inv.name,
      inv.email,
      inv.location,
      (inv.interests || []).join('; '),
      inv.status
    ]);
    const csv = [headers, ...rows].map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investors.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#10182A] p-8">
      {/* Убрана кнопка Выйти из панели */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-center text-white">
          Админ-панель SilkGate
        </h2>
      </div>
      <div className="max-w-xs sm:max-w-2xl mx-auto mb-6 sm:mb-8 p-4 sm:p-6 bg-[#F5F6FA] rounded-lg shadow">
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setTab('investors')} className={`px-6 py-2 rounded-lg font-semibold ${tab === 'investors' ? 'bg-[#FFD700] text-[#10182A]' : 'bg-[#1A2238] text-white border border-[#FFD700]'}`}>Инвесторы (на модерации)</button>
          <button onClick={() => setTab('all')} className={`px-6 py-2 rounded-lg font-semibold ${tab === 'all' ? 'bg-[#FFD700] text-[#10182A]' : 'bg-[#1A2238] text-white border border-[#FFD700]'}`}>Все инвесторы</button>
          <button onClick={() => setTab('startups')} className={`px-6 py-2 rounded-lg font-semibold ${tab === 'startups' ? 'bg-[#FFD700] text-[#10182A]' : 'bg-[#1A2238] text-white border border-[#FFD700]'}`}>Стартапы (на модерации)</button>
          <button onClick={() => setTab('allStartups')} className={`px-6 py-2 rounded-lg font-semibold ${tab === 'allStartups' ? 'bg-[#FFD700] text-[#10182A]' : 'bg-[#1A2238] text-white border border-[#FFD700]'}`}>Все стартапы</button>
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
                      <button onClick={() => handleApprove('investors', inv._id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-semibold">Одобрить</button>
                      <button onClick={() => handleReject('investors', inv._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-semibold">Отклонить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {tab === 'all' && (
              <div className="overflow-x-auto">
                <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch">
                  <input
                    className="px-3 py-2 border rounded text-xs sm:text-base w-full sm:w-auto"
                    type="text"
                    placeholder="Имя"
                    value={investorName}
                    onChange={e => setInvestorName(e.target.value)}
                  />
                  <input
                    className="px-3 py-2 border rounded text-xs sm:text-base w-full sm:w-auto"
                    type="text"
                    placeholder="Локация"
                    value={investorLocation}
                    onChange={e => setInvestorLocation(e.target.value)}
                  />
                  <select
                    className="px-3 py-2 border rounded text-xs sm:text-base w-full sm:w-auto"
                    value={investorInterest}
                    onChange={e => setInvestorInterest(e.target.value)}
                  >
                    <option value="">Все интересы</option>
                    {investorInterests.map(int => <option key={int} value={int}>{int}</option>)}
                  </select>
                  <button
                    className="px-3 py-2 bg-gray-200 rounded text-xs sm:text-base hover:bg-gray-300 w-full sm:w-auto"
                    onClick={() => { setInvestorName(''); setInvestorLocation(''); setInvestorInterest(''); }}
                    type="button"
                  >
                    Сбросить
                  </button>
                  <button
                    className="px-3 py-2 bg-blue-600 text-white rounded text-xs sm:text-base hover:bg-blue-700 w-full sm:w-auto"
                    onClick={exportInvestorsToCSV}
                    type="button"
                  >
                    Экспорт в CSV
                  </button>
                </div>
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Имя</th>
                      <th className="p-2 border">Email</th>
                      <th className="p-2 border">Локация</th>
                      <th className="p-2 border">Интересы</th>
                      <th className="p-2 border">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvestors.map(inv => (
                      <tr key={inv._id} className="border-b">
                        <td className="p-2 border">{inv.name}</td>
                        <td className="p-2 border">{inv.email}</td>
                        <td className="p-2 border">{inv.location}</td>
                        <td className="p-2 border">{(inv.interests || []).join(', ')}</td>
                        <td className="p-2 border font-semibold">
                          {inv.status === 'approved' && <span className="text-green-700">Одобрен</span>}
                          {inv.status === 'rejected' && <span className="text-red-700">Отклонён</span>}
                          {inv.status === 'pending' && <span className="text-gray-500">На модерации</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab === 'allStartups' && (
              <div className="overflow-x-auto">
                <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch">
                  <select
                    className="px-3 py-2 border rounded text-xs sm:text-base w-full sm:w-auto"
                    value={startupIndustry}
                    onChange={e => setStartupIndustry(e.target.value)}
                  >
                    <option value="">Все индустрии</option>
                    {startupIndustries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                  <input
                    className="px-3 py-2 border rounded text-xs sm:text-base w-full sm:w-auto"
                    type="text"
                    placeholder="Локация"
                    value={startupLocation}
                    onChange={e => setStartupLocation(e.target.value)}
                  />
                  <input
                    className="px-3 py-2 border rounded text-xs sm:text-base w-full sm:w-auto"
                    type="text"
                    placeholder="Поиск по названию"
                    value={startupName}
                    onChange={e => setStartupName(e.target.value)}
                  />
                  <button
                    className="px-3 py-2 bg-gray-200 rounded text-xs sm:text-base hover:bg-gray-300 w-full sm:w-auto"
                    onClick={() => { setStartupIndustry(''); setStartupLocation(''); setStartupName(''); }}
                    type="button"
                  >
                    Сбросить
                  </button>
                  <button
                    className="px-3 py-2 bg-blue-600 text-white rounded text-xs sm:text-base hover:bg-blue-700 w-full sm:w-auto"
                    onClick={exportStartupsToCSV}
                    type="button"
                  >
                    Экспорт в CSV
                  </button>
                </div>
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Название</th>
                      <th className="p-2 border">Описание</th>
                      <th className="p-2 border">Индустрия</th>
                      <th className="p-2 border">Локация</th>
                      <th className="p-2 border">Сумма</th>
                      <th className="p-2 border">Pitch Deck</th>
                      <th className="p-2 border">Имя владельца</th>
                      <th className="p-2 border">Email владельца</th>
                      <th className="p-2 border">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStartups
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(st => (
                        <tr key={st._id} className="border-b">
                          <td className="p-2 border">
                            <button
                              onClick={() => setModalStartup(st)}
                              className="text-blue-700 hover:underline font-semibold text-left w-full"
                              style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
                            >
                              {st.name}
                            </button>
                          </td>
                          <td className="p-2 border">{st.description}</td>
                          <td className="p-2 border">{st.industry}</td>
                          <td className="p-2 border">{st.location}</td>
                          <td className="p-2 border">{st.fundingAmount}</td>
                          <td className="p-2 border">{st.pitchDeckUrl ? <a href={st.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Ссылка</a> : '-'}</td>
                          <td className="p-2 border">{st.startupUserId?.name || '-'}</td>
                          <td className="p-2 border">{st.startupUserId?.email || '-'}</td>
                          <td className="p-2 border font-semibold">
                            {st.status === 'approved' && <span className="text-green-700">Одобрен</span>}
                            {st.status === 'rejected' && <span className="text-red-700">Отклонён</span>}
                            {st.status === 'pending' && <span className="text-gray-500">На модерации</span>}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <Modal open={!!modalStartup} onClose={() => setModalStartup(null)}>
                  {modalStartup && (
                    <div className="max-w-2xl">
                      <h3 className="text-2xl font-bold mb-4">{modalStartup.name || 'Без названия'}</h3>
                      <div className="space-y-3">
                        {modalStartup.description && (
                          <div className="mb-4">
                            <b className="text-lg">Описание:</b>
                            <p className="mt-1 text-gray-700">{modalStartup.description}</p>
                          </div>
                        )}
                        
                        {modalStartup.email && (
                          <div>
                            <b>Email:</b> {modalStartup.email}
                          </div>
                        )}
                        
                        {modalStartup.industry && (
                          <div>
                            <b>Индустрия:</b> {modalStartup.industry}
                          </div>
                        )}
                        
                        {modalStartup.location && (
                          <div>
                            <b>Локация:</b> {modalStartup.location}
                          </div>
                        )}
                        
                        {modalStartup.fundingAmount && (
                          <div>
                            <b>Сумма финансирования:</b> {modalStartup.fundingAmount}
                          </div>
                        )}
                        
                        {modalStartup.stage && (
                          <div>
                            <b>Стадия:</b> {modalStartup.stage}
                          </div>
                        )}
                        
                        {modalStartup.problem && (
                          <div>
                            <b>Проблема:</b> {modalStartup.problem}
                          </div>
                        )}
                        
                        {modalStartup.solution && (
                          <div>
                            <b>Решение:</b> {modalStartup.solution}
                          </div>
                        )}
                        
                        {modalStartup.team && (
                          <div>
                            <b>Команда:</b> {modalStartup.team}
                          </div>
                        )}
                        
                        {modalStartup.pitchDeckUrl && (
                          <div>
                            <b>Pitch Deck:</b>{' '}
                            <a 
                              href={modalStartup.pitchDeckUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline"
                            >
                              Смотреть презентацию
                            </a>
                          </div>
                        )}
                        
                        {modalStartup.website && (
                          <div>
                            <b>Веб-сайт:</b>{' '}
                            <a 
                              href={modalStartup.website} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline"
                            >
                              {modalStartup.website}
                            </a>
                          </div>
                        )}
                        
                        {modalStartup.startupUserId && (
                          <div>
                            <b>Владелец:</b> {modalStartup.startupUserId.name || modalStartup.startupUserId.email || '—'}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <button 
                          onClick={() => setModalStartup(null)} 
                          className="px-4 py-2 bg-[#FFD700] text-[#10182A] rounded hover:bg-yellow-400 font-semibold transition"
                        >
                          Закрыть
                        </button>
                      </div>
                    </div>
                  )}
                </Modal>
              </div>
            )}
          </div>
        )}
        {tab === 'startups' && (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Название</th>
                  <th className="p-2 border">Описание</th>
                  <th className="p-2 border">Индустрия</th>
                  <th className="p-2 border">Локация</th>
                  <th className="p-2 border">Сумма</th>
                  <th className="p-2 border">Pitch Deck</th>
                  <th className="p-2 border">Имя владельца</th>
                  <th className="p-2 border">Email владельца</th>
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
                    <td className="p-2 border">{st.pitchDeckUrl ? <a href={st.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Ссылка</a> : '-'}</td>
                    <td className="p-2 border">{st.startupUserId?.name || '-'}</td>
                    <td className="p-2 border">{st.startupUserId?.email || '-'}</td>
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
    </div>
  );
} 