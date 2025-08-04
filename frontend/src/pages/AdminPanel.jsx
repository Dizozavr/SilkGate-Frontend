import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Shared/Icon';
import Modal from '../components/Shared/Modal';

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
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [news, setNews] = useState([]);
  const [newsStats, setNewsStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [startupSearch, setStartupSearch] = useState('');
  const [modalStartup, setModalStartup] = useState(null);
  const [modalInvestor, setModalInvestor] = useState(null);
  const [newsFilter, setNewsFilter] = useState('all');
  const [newsCategory, setNewsCategory] = useState('');
  const [expandedNews, setExpandedNews] = useState(new Set()); // Состояние для отслеживания раскрытых новостей

  // Фильтры для стартапов
  const [startupIndustry, setStartupIndustry] = useState('');
  const [startupLocation, setStartupLocation] = useState('');
  const [startupName, setStartupName] = useState('');
  // Фильтры для инвесторов
  const [investorName, setInvestorName] = useState('');
  const [investorLocation, setInvestorLocation] = useState('');
  const [investorInterest, setInvestorInterest] = useState('');
  

  
  // Состояние для вакансий
  const [modalJob, setModalJob] = useState(null);
  const [jobFilter, setJobFilter] = useState('all');

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



  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('http://localhost:5000/api/jobs/pending');
      if (!res.ok) throw new Error('Ошибка загрузки вакансий');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('http://localhost:5000/api/jobs/all');
      if (!res.ok) throw new Error('Ошибка загрузки вакансий');
      const data = await res.json();
      setAllJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin');
    if (tab === 'investors') fetchInvestors();
    if (tab === 'all') fetchAllInvestors();
    if (tab === 'startups') fetchStartups();
    if (tab === 'allStartups') fetchAllStartups();
    if (tab === 'jobs') fetchJobs();
    if (tab === 'allJobs') fetchAllJobs();
    if (tab === 'news') {
      fetchNews();
      fetchNewsStats();
    }
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
      setModalInvestor(null);
      setModalStartup(null);
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
      setModalInvestor(null);
      setModalStartup(null);
    } catch (err) {
      setError(err.message);
    }
  }

  // Функции для работы с вакансиями
  const handleApproveJob = async (jobId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/jobs/${jobId}/approve`, {
        method: 'PUT'
      });
      if (response.ok) {
        fetchJobs();
        setModalJob(null);
      } else {
        setError('Ошибка при одобрении вакансии');
      }
    } catch (error) {
      setError('Ошибка при одобрении вакансии');
    }
  };

  const handleRejectJob = async (jobId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/jobs/${jobId}/reject`, {
        method: 'PUT'
      });
      if (response.ok) {
        fetchJobs();
        setModalJob(null);
      } else {
        setError('Ошибка при отклонении вакансии');
      }
    } catch (error) {
      setError('Ошибка при отклонении вакансии');
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/jobs/${jobId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchAllJobs();
        setModalJob(null);
      } else {
        setError('Ошибка при удалении вакансии');
      }
    } catch (error) {
      setError('Ошибка при удалении вакансии');
    }
  };

  // Функции для работы с новостями
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('http://localhost:5000/api/news/admin/all');
      if (!res.ok) throw new Error('Ошибка загрузки новостей');
      const data = await res.json();
      setNews(data.news || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsStats = async () => {
    try {
      const res = await fetchWithAuth('http://localhost:5000/api/news/admin/stats');
      if (!res.ok) throw new Error('Ошибка загрузки статистики новостей');
      const data = await res.json();
      setNewsStats(data);
    } catch (err) {
      console.error('Ошибка загрузки статистики новостей:', err);
    }
  };

  const handleScrapeNews = async () => {
    // Функция временно отключена в демо-версии
    alert('Функция сбора новостей временно отключена в демо-версии приложения.');
    return;
    
    // Закомментированный оригинальный код:
    /*
    try {
      setLoading(true);
      const res = await fetchWithAuth('http://localhost:5000/api/news/admin/scrape', {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Ошибка сбора новостей');
      const data = await res.json();
      alert(`Собрано ${data.scraped} новостей, сохранено ${data.saved} новых`);
      await fetchNews();
      await fetchNewsStats();
    } catch (error) {
      alert('Ошибка при сборе новостей: ' + error.message);
    } finally {
      setLoading(false);
    }
    */
  };

  const handleApproveNews = async (newsId) => {
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/news/admin/${newsId}/approve`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Ошибка одобрения новости');
      await fetchNews();
      await fetchNewsStats();
      alert('Новость одобрена');
    } catch (error) {
      alert('Ошибка при одобрении новости: ' + error.message);
    }
  };

  const handleRejectNews = async (newsId) => {
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/news/admin/${newsId}/reject`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Ошибка отклонения новости');
      await fetchNews();
      await fetchNewsStats();
      alert('Новость отклонена');
    } catch (error) {
      alert('Ошибка при отклонении новости: ' + error.message);
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту новость?')) return;
    
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/news/admin/${newsId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Ошибка удаления новости');
      
      // Обновляем список новостей
      await fetchNews();
      await fetchNewsStats();
    } catch (err) {
      setError(err.message);
    }
  };

  // Функция для переключения состояния раскрытия новости
  const toggleNewsExpansion = (newsId) => {
    const newExpanded = new Set(expandedNews);
    if (newExpanded.has(newsId)) {
      newExpanded.delete(newsId);
    } else {
      newExpanded.add(newsId);
    }
    setExpandedNews(newExpanded);
  };

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

  // Добавляем состояние для модалки во всех стартапах
  const [modalAllStartup, setModalAllStartup] = useState(null);

  // Для диагностики
  console.log('allStartups:', allStartups);

  return (
    <div className="min-h-screen bg-[#10182A] p-8">
      {/* Убрана кнопка Выйти из панели */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-light text-center text-white">
          Админ-панель SilkGate
        </h2>
      </div>
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-lg shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
          <button onClick={() => setTab('investors')} className={`px-4 py-3 rounded-lg font-light text-sm transition-all duration-200 ${tab === 'investors' ? 'bg-[#FFD700] text-[#10182A] shadow-lg' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center justify-center space-x-2">
              <Icon name="user" size={16} color={tab === 'investors' ? '#10182A' : 'black'} />
              <span>Инвесторы (на модерации)</span>
            </div>
          </button>
          <button onClick={() => setTab('all')} className={`px-4 py-3 rounded-lg font-light text-sm transition-all duration-200 ${tab === 'all' ? 'bg-[#FFD700] text-[#10182A] shadow-lg' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center justify-center space-x-2">
              <Icon name="user" size={16} color={tab === 'all' ? '#10182A' : 'black'} />
              <span>Все инвесторы</span>
            </div>
          </button>
          <button onClick={() => setTab('startups')} className={`px-4 py-3 rounded-lg font-light text-sm transition-all duration-200 ${tab === 'startups' ? 'bg-[#FFD700] text-[#10182A] shadow-lg' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center justify-center space-x-2">
              <Icon name="database" size={16} color={tab === 'startups' ? '#10182A' : 'black'} />
              <span>Стартапы (на модерации)</span>
            </div>
          </button>
          <button onClick={() => setTab('allStartups')} className={`px-4 py-3 rounded-lg font-light text-sm transition-all duration-200 ${tab === 'allStartups' ? 'bg-[#FFD700] text-[#10182A] shadow-lg' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center justify-center space-x-2">
              <Icon name="database" size={16} color={tab === 'allStartups' ? '#10182A' : 'black'} />
              <span>Все стартапы</span>
            </div>
          </button>
          <button onClick={() => setTab('jobs')} className={`px-4 py-3 rounded-lg font-light text-sm transition-all duration-200 ${tab === 'jobs' ? 'bg-[#FFD700] text-[#10182A] shadow-lg' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center justify-center space-x-2">
              <Icon name="file" size={16} color={tab === 'jobs' ? '#10182A' : 'black'} />
              <span>Вакансии (на модерации)</span>
            </div>
          </button>
          <button onClick={() => setTab('allJobs')} className={`px-4 py-3 rounded-lg font-light text-sm transition-all duration-200 ${tab === 'allJobs' ? 'bg-[#FFD700] text-[#10182A] shadow-lg' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center justify-center space-x-2">
              <Icon name="file" size={16} color={tab === 'allJobs' ? '#10182A' : 'black'} />
              <span>Все вакансии</span>
            </div>
          </button>
          <button onClick={() => setTab('news')} className={`px-4 py-3 rounded-lg font-light text-sm transition-all duration-200 ${tab === 'news' ? 'bg-[#FFD700] text-[#10182A] shadow-lg' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center justify-center space-x-2">
              <Icon name="notification" size={16} color={tab === 'news' ? '#10182A' : 'black'} />
              <span>Новости</span>
            </div>
          </button>
        </div>
        {error && <div className="mb-4 text-red-600 text-center font-light">{error}</div>}
        {loading ? (
          <div className="text-center text-gray-600 font-light">Загрузка...</div>
        ) : tab === 'investors' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                                 <tr className="bg-gray-50">
                   <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Имя</th>
                   <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Email</th>
                   <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Локация</th>
                   <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Интересы</th>
                   <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Действия</th>
                 </tr>
              </thead>
              <tbody>
                {investors.map(inv => (
                  <tr key={inv._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="p-3 text-sm font-medium text-gray-900">{inv.name}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{inv.email}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{inv.location}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{(inv.interests || []).join(', ')}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => setModalInvestor(inv)} className="px-3 py-1 bg-[#3B82F6] text-white rounded hover:bg-blue-700 font-light text-sm transition-colors">Детали</button>
                      <button onClick={() => handleApprove('investors', inv._id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-light text-sm transition-colors">Одобрить</button>
                      <button onClick={() => handleReject('investors', inv._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-light text-sm transition-colors">Отклонить</button>
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
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Имя</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Локация</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Интересы</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvestors.map(inv => (
                      <tr key={inv._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm font-medium text-gray-900">{inv.name}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{inv.email}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{inv.location}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{(inv.interests || []).join(', ')}</td>
                        <td className="p-3 text-sm font-light">
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
            {tab === 'jobs' && (
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Название</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Компания</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Контакт</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Описание</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Отправитель</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Дата</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(job => (
                      <tr key={job._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm font-medium text-gray-900">{job.title}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{job.company}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{job.contact}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{job.description?.substring(0, 50)}...</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{job.submittedBy}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{new Date(job.submittedAt).toLocaleDateString()}</td>
                        <td className="p-3 flex gap-2">
                          <button onClick={() => setModalJob(job)} className="px-3 py-1 bg-[#3B82F6] text-white rounded hover:bg-blue-700 font-light text-sm transition-colors">Детали</button>
                          <button onClick={() => handleApproveJob(job._id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-light text-sm transition-colors">Одобрить</button>
                          <button onClick={() => handleRejectJob(job._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-light text-sm transition-colors">Отклонить</button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === 'allJobs' && (
          <div className="overflow-x-auto">
            <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch">
              <select
                className="px-3 py-2 border rounded text-xs sm:text-base w-full sm:w-auto"
                value={jobFilter}
                onChange={e => setJobFilter(e.target.value)}
              >
                <option value="all">Все статусы</option>
                <option value="pending">На модерации</option>
                <option value="approved">Одобренные</option>
                <option value="rejected">Отклоненные</option>
              </select>
            </div>
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Название</th>
                  <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Компания</th>
                  <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Контакт</th>
                  <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Описание</th>
                  <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Отправитель</th>
                  <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Дата</th>
                  <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Статус</th>
                  <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Действия</th>
                </tr>
              </thead>
              <tbody>
                {allJobs
                  .filter(job => jobFilter === 'all' || job.status === jobFilter)
                  .map(job => (
                    <tr key={job._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-sm font-medium text-gray-900">{job.title}</td>
                      <td className="p-3 text-sm font-medium text-gray-900">{job.company}</td>
                      <td className="p-3 text-sm font-medium text-gray-900">{job.contact}</td>
                      <td className="p-3 text-sm font-medium text-gray-900">{job.description?.substring(0, 50)}...</td>
                      <td className="p-3 text-sm font-medium text-gray-900">{job.submittedBy}</td>
                      <td className="p-3 text-sm font-medium text-gray-900">{new Date(job.submittedAt).toLocaleDateString()}</td>
                      <td className="p-3 text-sm font-medium">
                        {job.status === 'approved' && <span className="text-green-700">Одобрена</span>}
                        {job.status === 'rejected' && <span className="text-red-700">Отклонена</span>}
                        {job.status === 'pending' && <span className="text-gray-500">На модерации</span>}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => setModalJob(job)} className="px-3 py-1 bg-[#3B82F6] text-white rounded hover:bg-blue-700 font-light text-sm transition-colors">Детали</button>
                        {job.status === 'pending' && (
                          <>
                            <button onClick={() => handleApproveJob(job._id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-light text-sm transition-colors">Одобрить</button>
                            <button onClick={() => handleRejectJob(job._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-light text-sm transition-colors">Отклонить</button>
                          </>
                        )}
                        <button onClick={() => handleDeleteJob(job._id)} className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 font-light text-sm transition-colors">Удалить</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === 'news' && (
          <div className="overflow-x-auto">
            <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch">
              <button
                onClick={handleScrapeNews}
                className="px-4 py-2 bg-gray-400 text-white rounded font-semibold cursor-not-allowed"
                disabled={true}
                title="Функция временно отключена в демо-версии"
              >
                Собрать новости (ДЕМО)
              </button>
              <select
                className="px-3 py-2 border rounded text-xs sm:text-base w-full sm:w-auto"
                value={newsFilter}
                onChange={e => setNewsFilter(e.target.value)}
              >
                <option value="all">Все статусы</option>
                <option value="pending">На модерации</option>
                <option value="approved">Одобренные</option>
                <option value="rejected">Отклоненные</option>
              </select>
              <select
                className="px-3 py-2 border rounded text-xs sm:text-base w-full sm:w-auto"
                value={newsCategory}
                onChange={e => setNewsCategory(e.target.value)}
              >
                <option value="">Все категории</option>
                <option value="technology">Технологии</option>
                <option value="startups">Стартапы</option>
                <option value="ai">ИИ</option>
                <option value="cybersecurity">Кибербезопасность</option>
                <option value="mobile">Мобильные</option>
                <option value="web">Веб</option>
                <option value="other">Другое</option>
              </select>
            </div>
            
            {/* Статистика */}
            {newsStats.total !== undefined && (
              <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-100 p-3 rounded">
                  <div className="text-lg font-bold text-blue-800">{newsStats.total || 0}</div>
                  <div className="text-sm text-blue-600">Всего новостей</div>
                </div>
                <div className="bg-yellow-100 p-3 rounded">
                  <div className="text-lg font-bold text-yellow-800">{newsStats.pending || 0}</div>
                  <div className="text-sm text-yellow-600">На модерации</div>
                </div>
                <div className="bg-green-100 p-3 rounded">
                  <div className="text-lg font-bold text-green-800">{newsStats.approved || 0}</div>
                  <div className="text-sm text-green-600">Одобренные</div>
                </div>
                <div className="bg-red-100 p-3 rounded">
                  <div className="text-lg font-bold text-red-800">{newsStats.rejected || 0}</div>
                  <div className="text-sm text-red-600">Отклоненные</div>
                </div>
              </div>
            )}
            
            {/* Inline отображение новостей */}
            <div className="space-y-4">
              {news
                .filter(newsItem => newsFilter === 'all' || newsItem.status === newsFilter)
                .filter(newsItem => !newsCategory || newsItem.category === newsCategory)
                .map(newsItem => (
                  <div key={newsItem._id} className="border rounded-lg p-4 bg-white shadow-sm">
                    {/* Основная информация */}
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg mb-1 text-gray-900">{newsItem.title.translated}</h3>
                      <div className="text-sm text-gray-700 mb-2">{newsItem.title.original}</div>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-medium text-gray-900">{newsItem.source.name}</span>
                        <span className="text-gray-500">•</span>
                        <span className="px-2 py-1 bg-gray-200 rounded text-xs text-gray-900">
                          {newsItem.category}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-900">{new Date(newsItem.createdAt).toLocaleDateString()}</span>
                        <span className="text-gray-500">•</span>
                        <span className={`font-semibold ${
                          newsItem.status === 'approved' ? 'text-green-700' :
                          newsItem.status === 'rejected' ? 'text-red-700' :
                          'text-yellow-600'
                        }`}>
                          {newsItem.status === 'approved' ? 'Одобрена' :
                           newsItem.status === 'rejected' ? 'Отклонена' :
                           'На модерации'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Компактные команды в одну строку снизу */}
                    <div className="flex flex-wrap items-center gap-2 text-xs border-t pt-2">
                      <button 
                        onClick={() => toggleNewsExpansion(newsItem._id)}
                        className="text-[#3B82F6] hover:text-blue-800 hover:underline font-medium"
                      >
                        {expandedNews.has(newsItem._id) ? 'Скрыть' : 'Детали'}
                      </button>
                      {newsItem.status === 'pending' && (
                        <>
                          <span className="text-gray-400">|</span>
                          <button 
                            onClick={() => handleApproveNews(newsItem._id)}
                            className="text-green-600 hover:text-green-800 hover:underline font-medium"
                          >
                            Одобрить
                          </button>
                          <span className="text-gray-400">|</span>
                          <button 
                            onClick={() => handleRejectNews(newsItem._id)}
                            className="text-red-600 hover:text-red-800 hover:underline font-medium"
                          >
                            Отклонить
                          </button>
                        </>
                      )}
                      <span className="text-gray-400">|</span>
                      <button 
                        onClick={() => handleDeleteNews(newsItem._id)}
                        className="text-gray-700 hover:text-gray-900 hover:underline font-medium"
                      >
                        Удалить
                      </button>
                    </div>

                    {/* Раскрывающиеся детали */}
                    {expandedNews.has(newsItem._id) && (
                      <div className="border-t pt-4 mt-3">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Содержание */}
                          <div>
                            <h4 className="font-semibold mb-2 text-gray-900">Содержание (переведенное):</h4>
                            <div className="bg-gray-50 p-3 rounded text-sm leading-relaxed max-h-40 overflow-y-auto text-gray-900">
                              {newsItem.content.translated}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-gray-900">Содержание (оригинал):</h4>
                            <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto">
                              {newsItem.content.original}
                            </div>
                          </div>
                        </div>

                        {/* Краткое описание */}
                        {newsItem.summary && (
                          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2 text-gray-900">Краткое описание (переведенное):</h4>
                              <div className="bg-gray-50 p-3 rounded text-gray-900">
                                {newsItem.summary.translated}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2 text-gray-900">Краткое описание (оригинал):</h4>
                              <div className="bg-gray-50 p-3 rounded text-gray-700">
                                {newsItem.summary.original}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Источник */}
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2 text-gray-900">Источник:</h4>
                          <div className="bg-gray-50 p-3 rounded text-gray-900">
                            <div className="mb-2"><b>Название:</b> {newsItem.source.name}</div>
                            <div className="mb-2">
                              <b>Ссылка:</b> 
                              <a 
                                href={newsItem.source.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#3B82F6] hover:underline ml-1 break-all"
                              >
                                {newsItem.source.url}
                              </a>
                            </div>
                            {newsItem.source.logo && (
                              <div>
                                <b>Логотип:</b> 
                                <a 
                                  href={newsItem.source.logo} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline ml-1 break-all"
                                >
                                  {newsItem.source.logo}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Изображение */}
                        {newsItem.image && newsItem.image.url && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Изображение:</h4>
                            <div className="flex justify-center">
                              <img 
                                src={newsItem.image.url} 
                                alt={newsItem.image.alt || 'Изображение новости'} 
                                className="max-w-full h-auto max-h-60 rounded-lg shadow-lg"
                              />
                            </div>
                            {newsItem.image.alt && (
                              <div className="text-sm text-gray-600 mt-2 text-center">{newsItem.image.alt}</div>
                            )}
                          </div>
                        )}

                        {/* Теги */}
                        {newsItem.tags && newsItem.tags.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Теги:</h4>
                            <div className="flex flex-wrap gap-2">
                              {newsItem.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
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
                    <tr className="bg-gray-50">
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Название</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Описание</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Индустрия</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Локация</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Сумма</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Pitch Deck</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Имя владельца</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Email владельца</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Статус</th>
                      <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStartups
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(st => (
                        <tr key={st._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                  <td className="p-3 text-sm font-medium text-gray-900">{st.name}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{st.description}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{st.industry}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{st.location}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{st.fundingAmount}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{st.pitchDeckUrl ? <a href={st.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">Ссылка</a> : '-'}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{st.startupUserId?.name || '-'}</td>
                        <td className="p-3 text-sm font-medium text-gray-900">{st.startupUserId?.email || '-'}</td>
                          <td className="p-3 text-sm font-light">
                            {st.status === 'approved' && <span className="text-green-700">Одобрен</span>}
                            {st.status === 'rejected' && <span className="text-red-700">Отклонён</span>}
                            {st.status === 'pending' && <span className="text-gray-500">На модерации</span>}
                          </td>
                          <td className="p-3">
                            <button 
                              onClick={() => setModalAllStartup(st)} 
                              className="px-3 py-1 bg-[#3B82F6] text-white rounded hover:bg-blue-700 font-light text-sm transition-colors"
                            >
                              Детали
                            </button>
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
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <button 
                          onClick={() => setModalStartup(null)} 
                          className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-700 font-light transition-colors"
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
                <tr className="bg-gray-50">
                  <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Название</th>
                  <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Индустрия</th>
                  <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Локация</th>
                  <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Действия</th>
                </tr>
              </thead>
              <tbody>
                {startups.map(st => (
                  <tr key={st._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm font-medium text-gray-900">{st.name}</td>
                    <td className="p-3 text-sm font-medium text-gray-900">{st.email}</td>
                    <td className="p-3 text-sm font-medium text-gray-900">{st.industry}</td>
                    <td className="p-3 text-sm font-medium text-gray-900">{st.location}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => setModalStartup(st)} className="px-3 py-1 bg-[#3B82F6] text-white rounded hover:bg-blue-700 font-light text-sm transition-colors">Детали</button>
                      <button onClick={() => handleApprove('startups', st._id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-light text-sm transition-colors">Одобрить</button>
                      <button onClick={() => handleReject('startups', st._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-light text-sm transition-colors">Отклонить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модальное окно для инвестора */}
      <Modal open={!!modalInvestor} onClose={() => setModalInvestor(null)}>
        {modalInvestor && (
          <div className="text-gray-900">
            <h2 className="text-xl font-light mb-4 text-gray-900">Анкета инвестора</h2>
            <div className="mb-2 text-gray-900"><b>Имя:</b> {modalInvestor.name}</div>
            <div className="mb-2 text-gray-900"><b>Email:</b> {modalInvestor.email}</div>
            <div className="mb-2 text-gray-900"><b>Локация:</b> {modalInvestor.location}</div>
            <div className="mb-2 text-gray-900"><b>Интересы:</b> {(modalInvestor.interests || []).join(', ')}</div>
            {modalInvestor.investorType && <div className="mb-2 text-gray-900"><b>Тип инвестора:</b> {modalInvestor.investorType}</div>}
            {modalInvestor.investmentRange && (
              <div className="mb-2 text-gray-900">
                <b>Диапазон инвестиций:</b> {typeof modalInvestor.investmentRange === 'object' 
                  ? `${modalInvestor.investmentRange.min || 0} — ${modalInvestor.investmentRange.max || 0}`
                  : String(modalInvestor.investmentRange)
                }
              </div>
            )}
            {modalInvestor.sectors && (
              <div className="mb-2 text-gray-900">
                <b>Секторы:</b> {Array.isArray(modalInvestor.sectors) 
                  ? modalInvestor.sectors.join(', ')
                  : String(modalInvestor.sectors)
                }
              </div>
            )}
            {modalInvestor.experience && <div className="mb-2 text-gray-900"><b>Опыт:</b> {modalInvestor.experience}</div>}
            {modalInvestor.goals && <div className="mb-2 text-gray-900"><b>Цели:</b> {modalInvestor.goals}</div>}
            <div className="flex gap-4 mt-6">
              <button onClick={() => handleApprove('investors', modalInvestor._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-light transition-colors">Одобрить</button>
              <button onClick={() => handleReject('investors', modalInvestor._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-light transition-colors">Отклонить</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно для стартапа */}
      <Modal open={!!modalStartup} onClose={() => setModalStartup(null)}>
        {modalStartup && (
          <div className="text-gray-900">
            <h2 className="text-xl font-light mb-4 text-gray-900">Анкета стартапа</h2>
            <div className="mb-2 text-gray-900"><b>Название:</b> {modalStartup.name}</div>
            <div className="mb-2 text-gray-900"><b>Email:</b> {modalStartup.email}</div>
            <div className="mb-2 text-gray-900"><b>Описание:</b> {modalStartup.description || '—'}</div>
            <div className="mb-2 text-gray-900"><b>Индустрия:</b> {modalStartup.industry}</div>
            <div className="mb-2 text-gray-900"><b>Локация:</b> {modalStartup.location}</div>
            <div className="mb-2 text-gray-900"><b>Сумма финансирования:</b> {modalStartup.fundingAmount || '—'}</div>
            {modalStartup.stage && <div className="mb-2 text-gray-900"><b>Стадия:</b> {modalStartup.stage}</div>}
            {modalStartup.problem && <div className="mb-2 text-gray-900"><b>Проблема:</b> {modalStartup.problem}</div>}
            {modalStartup.solution && <div className="mb-2 text-gray-900"><b>Решение:</b> {modalStartup.solution}</div>}
            {modalStartup.team && (
              <div className="mb-2 text-gray-900">
                <b>Команда:</b> {Array.isArray(modalStartup.team) 
                  ? modalStartup.team.map((member, index) => 
                      `${member.name || 'Без имени'}${member.role ? ` (${member.role})` : ''}`
                    ).join(', ')
                  : String(modalStartup.team)
                }
              </div>
            )}
            {modalStartup.pitchDeckUrl && (
              <div className="mb-2 text-gray-900">
                <b>Pitch Deck:</b> <a href={modalStartup.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">Скачать</a>
              </div>
            )}
            {modalStartup.website && (
              <div className="mb-2 text-gray-900">
                <b>Веб-сайт:</b> <a href={modalStartup.website} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">{modalStartup.website}</a>
              </div>
            )}
            <div className="flex gap-4 mt-6">
              <button onClick={() => handleApprove('startups', modalStartup._id)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold">Одобрить</button>
              <button onClick={() => handleReject('startups', modalStartup._id)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold">Отклонить</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно для просмотра всех стартапов */}
      <Modal open={!!modalAllStartup} onClose={() => setModalAllStartup(null)}>
        {modalAllStartup && typeof modalAllStartup === 'object' ? (
          <div className="text-gray-900">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Информация о стартапе</h2>
            <div className="mb-2 text-gray-900"><b>Название:</b> {modalAllStartup.name || '—'}</div>
            <div className="mb-2 text-gray-900"><b>Email:</b> {modalAllStartup.email || '—'}</div>
            <div className="mb-2 text-gray-900"><b>Описание:</b> {modalAllStartup.description || '—'}</div>
            <div className="mb-2 text-gray-900"><b>Индустрия:</b> {modalAllStartup.industry || '—'}</div>
            <div className="mb-2 text-gray-900"><b>Локация:</b> {modalAllStartup.location || '—'}</div>
            <div className="mb-2 text-gray-900"><b>Сумма финансирования:</b> {modalAllStartup.fundingAmount || '—'}</div>
            {modalAllStartup.stage && <div className="mb-2 text-gray-900"><b>Стадия:</b> {modalAllStartup.stage}</div>}
            {modalAllStartup.problem && <div className="mb-2 text-gray-900"><b>Проблема:</b> {modalAllStartup.problem}</div>}
            {modalAllStartup.solution && <div className="mb-2 text-gray-900"><b>Решение:</b> {modalAllStartup.solution}</div>}
            {modalAllStartup.team && (
              <div className="mb-2 text-gray-900">
                <b>Команда:</b> {Array.isArray(modalAllStartup.team) 
                  ? modalAllStartup.team.map((member, index) => 
                      `${member.name || 'Без имени'}${member.role ? ` (${member.role})` : ''}`
                    ).join(', ')
                  : String(modalAllStartup.team)
                }
              </div>
            )}
            {modalAllStartup.pitchDeckUrl && (
              <div className="mb-2 text-gray-900">
                <b>Pitch Deck:</b> <a href={modalAllStartup.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">Скачать</a>
              </div>
            )}
            {modalAllStartup.website && (
              <div className="mb-2 text-gray-900">
                <b>Веб-сайт:</b> <a href={modalAllStartup.website} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">{modalAllStartup.website}</a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-900">Ошибка: данные стартапа не найдены или некорректны.</div>
        )}
      </Modal>

      {/* Модальное окно для вакансии */}
      <Modal open={!!modalJob} onClose={() => setModalJob(null)}>
        {modalJob && (
          <div className="text-gray-900">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Детали вакансии</h2>
            <div className="mb-2 text-gray-900"><b>Название:</b> {modalJob.title}</div>
            <div className="mb-2 text-gray-900"><b>Компания:</b> {modalJob.company}</div>
            <div className="mb-2 text-gray-900"><b>Контакт:</b> {modalJob.contact}</div>
            <div className="mb-2 text-gray-900"><b>Описание:</b> {modalJob.description}</div>
            <div className="mb-2 text-gray-900"><b>Отправитель:</b> {modalJob.submittedBy}</div>
            <div className="mb-2 text-gray-900"><b>Дата отправки:</b> {new Date(modalJob.submittedAt).toLocaleString()}</div>
            {modalJob.location && <div className="mb-2 text-gray-900"><b>Локация:</b> {modalJob.location}</div>}
            {modalJob.salary && <div className="mb-2 text-gray-900"><b>Зарплата:</b> {modalJob.salary}</div>}
            {modalJob.requirements && <div className="mb-2 text-gray-900"><b>Требования:</b> {modalJob.requirements}</div>}
            {modalJob.status && (
              <div className="mb-2 text-gray-900">
                <b>Статус:</b> 
                {modalJob.status === 'approved' && <span className="text-green-700 ml-2">Одобрена</span>}
                {modalJob.status === 'rejected' && <span className="text-red-700 ml-2">Отклонена</span>}
                {modalJob.status === 'pending' && <span className="text-gray-500 ml-2">На модерации</span>}
              </div>
            )}
            {modalJob.approvedAt && <div className="mb-2 text-gray-900"><b>Дата одобрения:</b> {new Date(modalJob.approvedAt).toLocaleString()}</div>}
            {modalJob.approvedBy && <div className="mb-2 text-gray-900"><b>Одобрено:</b> {modalJob.approvedBy}</div>}
            
            <div className="flex gap-4 mt-6">
              {modalJob.status === 'pending' && (
                <>
                  <button onClick={() => handleApproveJob(modalJob._id)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold">Одобрить</button>
                  <button onClick={() => handleRejectJob(modalJob._id)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold">Отклонить</button>
                </>
              )}
              <button onClick={() => handleDeleteJob(modalJob._id)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-semibold">Удалить</button>
            </div>
          </div>
        )}
      </Modal>




    </div>
  );
} 