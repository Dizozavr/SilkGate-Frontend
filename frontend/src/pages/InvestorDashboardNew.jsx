import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/Shared/ToastProvider';

import Icon from '../components/Shared/Icon';
import Modal from '../components/Shared/Modal';
import WhatsAppChat from '../components/Chat/WhatsAppChat';

function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('investorToken');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
}



export default function InvestorDashboardNew() {
  const [startups, setStartups] = useState([]);
  const [filter, setFilter] = useState({ industry: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interested, setInterested] = useState({});
  const [search, setSearch] = useState('');
  const [modalStartup, setModalStartup] = useState(null);

  

  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem('investorToken');
    if (!token) navigate('/login');
    loadStartups();
    loadInterests();
    loadProfile();
    // eslint-disable-next-line
  }, []);

  async function loadProfile() {
    try {
      const res = await fetchWithAuth('http://localhost:5000/api/investors/me');
      if (!res.ok) {
        toast.showToast('Ошибка авторизации. Войдите заново.', 'error');
        navigate('/login');
        return;
      }
      setProfile(await res.json());
    } catch {
      toast.showToast('Ошибка авторизации. Войдите заново.', 'error');
      navigate('/login');
    }
  }

  function handleEditOpen() {
    setEditForm({
      ...profile,
      investmentRangeMin: profile?.investmentRange?.min || '',
      investmentRangeMax: profile?.investmentRange?.max || '',
      interests: (profile?.interests || []).join(', '),
      preferredStages: (profile?.preferredStages || []).join(', '),
      geoFocus: (profile?.geoFocus || []).join(', '),
      dealType: (profile?.dealType || []).join(', '),
      linkedin: profile?.contactLinks?.linkedin || '',
      telegram: profile?.contactLinks?.telegram || '',
    });
    setEditError('');
    setEditOpen(true);
  }

  function handleEditChange(e) {
    const { name, value, type, checked } = e.target;
    setEditForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await fetchWithAuth('http://localhost:5000/api/investors/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          location: editForm.location,
          investorType: editForm.investorType,
          investmentRange: {
            min: Number(editForm.investmentRangeMin) || 0,
            max: Number(editForm.investmentRangeMax) || 0,
          },
          interests: editForm.interests.split(',').map(s => s.trim()).filter(Boolean),
          preferredStages: editForm.preferredStages.split(',').map(s => s.trim()).filter(Boolean),
          geoFocus: editForm.geoFocus.split(',').map(s => s.trim()).filter(Boolean),
          dealType: editForm.dealType.split(',').map(s => s.trim()).filter(Boolean),
          publicProfile: editForm.publicProfile,
          bio: editForm.bio,
          contactLinks: {
            linkedin: editForm.linkedin,
            telegram: editForm.telegram,
          },
        }),
      });
      if (!res.ok) throw new Error('Ошибка сохранения профиля');
      toast.showToast('Профиль обновлён!', 'success');
      setEditOpen(false);
      loadProfile();
    } catch (err) {
      toast.showToast(err.message, 'error');
    } finally {
      setEditLoading(false);
    }
  }

  async function loadStartups() {
    setLoading(true);
    setError('');
    try {
      const res = await fetchWithAuth('http://localhost:5000/api/startups/approved');
      if (!res.ok) throw new Error('Ошибка загрузки стартапов');
      const data = await res.json();
      
      console.log('API ответ:', data);
      console.log('Тип данных:', typeof data);
      console.log('Это массив?', Array.isArray(data));
      console.log('Количество элементов:', data.length);
      
      // Проверяем и очищаем данные от потенциально проблемных значений
      const cleanData = Array.isArray(data) ? data.filter(item => {
        if (!item || typeof item !== 'object') return false;
        
        try {
          // Удаляем циклические ссылки и проблемные поля
          const cleanItem = { ...item };
          delete cleanItem.__v;
          delete cleanItem.password;
          
          // Проверяем, что объект можно сериализовать
          JSON.stringify(cleanItem);
          return cleanItem;
        } catch (e) {
          console.warn('Пропускаем проблемный объект стартапа:', e);
          return false;
        }
      }) : [];
      
      setStartups(cleanData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadInterests() {
    try {
      const res = await fetchWithAuth('http://localhost:5000/api/investors/interests');
      if (!res.ok) return;
      const data = await res.json();
      // data — массив стартапов
      const map = {};
      data.forEach(st => { if (st && st._id) map[st._id] = true; });
      setInterested(map);
    } catch {}
  }

  async function handleInterested(id) {
    try {
      if (interested[id]) {
        await fetchWithAuth(`http://localhost:5000/api/investors/interests/${id}`, { method: 'DELETE' });
        setInterested(prev => ({ ...prev, [id]: false }));
      } else {
        await fetchWithAuth('http://localhost:5000/api/investors/interests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startupId: id })
        });
        setInterested(prev => ({ ...prev, [id]: true }));
      }
    } catch {}
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilter(f => ({ ...f, [name]: value }));
  }

  // Получить уникальные индустрии для выпадающего списка
  const industries = Array.from(new Set(startups.map(st => st.industry).filter(Boolean)));

  function filteredStartups() {
    return startups.filter(st =>
      (!filter.industry || st.industry === filter.industry) &&
      (!filter.location || (st.location || '').toLowerCase().includes(filter.location.toLowerCase())) &&
      (!search || (st.name || '').toLowerCase().includes(search.toLowerCase()))
    );
  }

  return (
    <div className="min-h-screen bg-[#10182A] p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-light text-center text-white">
          Дашборд инвестора
        </h2>
      </div>
      
      {/* Профиль инвестора */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-lg shadow-lg relative">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h3 className="text-lg sm:text-xl font-light text-[#10182A]">
            Мой профиль
          </h3>
          <div className="flex items-center space-x-3">
            <Link
              to="/analytics"
              className="text-[#3B82F6] hover:text-blue-800 text-xs font-light transition px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 flex items-center space-x-1"
            >
              <Icon name="dashboard" size={14} color="black" />
              <span>Аналитика</span>
            </Link>
            <button
              onClick={handleEditOpen}
              className="text-gray-500 hover:text-[#3B82F6] hover:underline text-xs font-light transition px-3 py-1 rounded absolute right-4 bottom-4 flex items-center space-x-1"
              style={{ minWidth: 'auto' }}
            >
              <Icon name="edit" size={14} color="black" />
              <span>Редактировать</span>
            </button>
          </div>
        </div>
        {(!profile) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 text-sm font-light text-gray-900">
            <div className="flex items-center space-x-2"><Icon name="user" size={16} color="black" /><span><span className="font-medium">Имя:</span> Murod</span></div>
            <div className="flex items-center space-x-2"><Icon name="award" size={16} color="black" /><span><span className="font-medium">Тип:</span> —</span></div>
            <div className="flex items-center space-x-2"><Icon name="email" size={16} color="black" /><span><span className="font-medium">Email:</span> dizozavr@gmail.com</span></div>
            <div className="flex items-center space-x-2"><Icon name="dashboard" size={16} color="black" /><span><span className="font-medium">Инвестиционный диапазон:</span> 2000 — 50000</span></div>
            <div className="flex items-center space-x-2"><Icon name="heart" size={16} color="black" /><span><span className="font-medium">Интересы:</span> AI, SaaS</span></div>
            <div className="flex items-center space-x-2"><Icon name="compass" size={16} color="black" /><span><span className="font-medium">Стадии:</span> —</span></div>
            <div className="flex items-center space-x-2"><Icon name="location" size={16} color="black" /><span><span className="font-medium">Гео-фокус:</span> —</span></div>
            <div className="flex items-center space-x-2"><Icon name="file" size={16} color="black" /><span><span className="font-medium">Тип сделки:</span> —</span></div>
            <div className="flex items-center space-x-2"><Icon name="eye" size={16} color="black" /><span><span className="font-medium">Публичный профиль:</span> Нет</span></div>
            <div className="flex items-center space-x-2"><Icon name="chat" size={16} color="black" /><span><span className="font-medium">Telegram:</span> —</span></div>
            <div className="flex items-center space-x-2"><Icon name="file" size={16} color="black" /><span><span className="font-medium">Биография:</span> —</span></div>
            <div className="flex items-center space-x-2"><Icon name="user" size={16} color="black" /><span><span className="font-medium">LinkedIn:</span> —</span></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 text-sm font-light text-gray-900">
            <div className="flex items-center space-x-2"><Icon name="user" size={16} color="black" /><span><span className="font-medium">Имя:</span> {profile.name || '—'}</span></div>
            <div className="flex items-center space-x-2"><Icon name="award" size={16} color="black" /><span><span className="font-medium">Тип:</span> {profile.investorType || '—'}</span></div>
            <div className="flex items-center space-x-2"><Icon name="email" size={16} color="black" /><span><span className="font-medium">Email:</span> {profile.email || '—'}</span></div>
            <div className="flex items-center space-x-2"><Icon name="dashboard" size={16} color="black" /><span><span className="font-medium">Инвестиционный диапазон:</span> {profile.investmentRange ? `${profile.investmentRange.min} — ${profile.investmentRange.max}` : '—'}</span></div>
            <div className="flex items-center space-x-2"><Icon name="heart" size={16} color="black" /><span><span className="font-medium">Интересы:</span> {profile.interests ? profile.interests.join(', ') : '—'}</span></div>
            <div className="flex items-center space-x-2"><Icon name="compass" size={16} color="black" /><span><span className="font-medium">Стадии:</span> {profile.preferredStages ? profile.preferredStages.join(', ') : '—'}</span></div>
            <div className="flex items-center space-x-2"><Icon name="location" size={16} color="black" /><span><span className="font-medium">Гео-фокус:</span> {profile.geoFocus ? profile.geoFocus.join(', ') : '—'}</span></div>
            <div className="flex items-center space-x-2"><Icon name="file" size={16} color="black" /><span><span className="font-medium">Тип сделки:</span> {profile.dealType ? profile.dealType.join(', ') : '—'}</span></div>
            <div className="flex items-center space-x-2"><Icon name="eye" size={16} color="black" /><span><span className="font-medium">Публичный профиль:</span> {profile.publicProfile ? 'Да' : 'Нет'}</span></div>
            <div className="flex items-center space-x-2"><Icon name="chat" size={16} color="black" /><span><span className="font-medium">Telegram:</span> {profile.contactLinks?.telegram || '—'}</span></div>
            <div className="flex items-center space-x-2"><Icon name="file" size={16} color="black" /><span><span className="font-medium">Биография:</span> {profile.bio || '—'}</span></div>
            <div className="flex items-center space-x-2"><Icon name="user" size={16} color="black" /><span><span className="font-medium">LinkedIn:</span> {profile.contactLinks?.linkedin || '—'}</span></div>
          </div>
        )}
      </div>

      {/* Модальное окно редактирования профиля */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <form onSubmit={handleEditSubmit} className="space-y-4 text-gray-900">
          <h2 className="text-xl font-light mb-4 text-gray-900">Редактировать профиль</h2>
          {editError && <div className="text-red-600 text-sm">{editError}</div>}
          
          <div>
            <label className="block text-sm font-medium mb-1">Имя</label>
            <input
              type="text"
              name="name"
              value={editForm?.name || ''}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Локация</label>
            <input
              type="text"
              name="location"
              value={editForm?.location || ''}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Тип инвестора</label>
            <select
              name="investorType"
              value={editForm?.investorType || ''}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите тип</option>
              <option value="angel">Ангел-инвестор</option>
              <option value="vc">Венчурный капитал</option>
              <option value="corporate">Корпоративный инвестор</option>
              <option value="individual">Частный инвестор</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Мин. сумма ($)</label>
              <input
                type="number"
                name="investmentRangeMin"
                value={editForm?.investmentRangeMin || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Макс. сумма ($)</label>
              <input
                type="number"
                name="investmentRangeMax"
                value={editForm?.investmentRangeMax || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Интересы (через запятую)</label>
            <input
              type="text"
              name="interests"
              value={editForm?.interests || ''}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="AI, SaaS, FinTech"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Предпочитаемые стадии (через запятую)</label>
            <input
              type="text"
              name="preferredStages"
              value={editForm?.preferredStages || ''}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Seed, Series A, Series B"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Гео-фокус (через запятую)</label>
            <input
              type="text"
              name="geoFocus"
              value={editForm?.geoFocus || ''}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="США, Европа, Азия"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Тип сделки (через запятую)</label>
            <input
              type="text"
              name="dealType"
              value={editForm?.dealType || ''}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Акции, Конвертируемые облигации"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={editForm?.linkedin || ''}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telegram</label>
            <input
              type="text"
              name="telegram"
              value={editForm?.telegram || ''}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="@username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Биография</label>
            <textarea
              name="bio"
              value={editForm?.bio || ''}
              onChange={handleEditChange}
              rows={3}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Расскажите о себе..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="publicProfile"
              checked={editForm?.publicProfile || false}
              onChange={handleEditChange}
              className="mr-2"
            />
            <label className="text-sm">Публичный профиль</label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={editLoading}
              className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-light transition-colors"
            >
              {editLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-light transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </Modal>

      {/* Фильтры и поиск */}
      <div className="max-w-7xl mx-auto mb-6 p-4 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <select
            className="px-3 py-2 border border-gray-200 rounded text-sm font-light w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-gray-900"
            value={filter.industry}
            onChange={e => setFilter(f => ({ ...f, industry: e.target.value }))}
          >
            <option value="">Все индустрии</option>
            {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
          <input
            className="px-3 py-2 border border-gray-200 rounded text-sm font-light w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-gray-900 placeholder-gray-500"
            type="text"
            placeholder="Поиск по названию"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: '220px', flexGrow: 1 }}
          />
          <button
            className="px-3 py-2 bg-[#3B82F6] text-white rounded font-light hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto flex items-center justify-center space-x-2"
            style={{ minWidth: '90px', height: '40px', alignSelf: 'center' }}
            onClick={() => { setFilter({ industry: '', location: '' }); setSearch(''); }}
            type="button"
          >
            <Icon name="search" size={16} color="white" />
            <span>Сбросить</span>
          </button>
        </div>
      </div>
      
      {error && <div className="mb-4 text-red-600 text-center font-light">{error}</div>}
      {loading ? (
        <div className="text-center text-gray-700 font-light">Загрузка...</div>
      ) : startups.length === 0 ? (
        <div className="text-center text-gray-700 font-light">
          Нет доступных стартапов (количество: {startups.length})
          <br />
          <button 
            onClick={() => {
              console.log('Попытка загрузки стартапов');
              loadStartups();
            }}
            className="px-3 py-1 bg-[#3B82F6] text-white rounded mt-2 font-light transition-colors"
          >
            Загрузить заново
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Название</th>
                <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Описание</th>
                <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Индустрия</th>
                <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Сумма</th>
                <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Pitch Deck</th>
                <th className="p-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-900">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredStartups().map((st, idx) => {
                console.log('Рендерим стартап:', st.name, 'ID:', st._id);
                return (
                  <tr key={st._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm font-medium text-gray-900">{st.name}</td>
                  <td className="p-3 text-sm font-medium text-gray-900">{st.description}</td>
                  <td className="p-3 text-sm font-medium text-gray-900">{st.industry}</td>
                  <td className="p-3 text-sm font-medium text-gray-900">{st.fundingAmount}</td>
                  <td className="p-3 text-sm font-medium text-gray-900">
                    {st.pitchDeckUrl ? (
                      <a href={st.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline font-light">Смотреть</a>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-[#10182A] transition-colors"
                      title="Добавить в избранное"
                      onClick={() => handleInterested(st._id)}
                      style={{ background: interested[st._id] ? '#FFD700' : undefined, color: interested[st._id] ? '#10182A' : undefined }}
                    >
                      <Icon name="favorite" size={16} color="black" />
                    </button>
                    <button
                      className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-[#10182A] transition-colors"
                      title="Скрыть проект"
                      onClick={() => toast.showToast('Проект скрыт (заглушка)', 'info')}
                    >
                      <Icon name="minus" size={16} color="black" />
                    </button>
                    <button
                      className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-[#10182A] transition-colors"
                      title="Начать чат со стартапером"
                      onClick={() => {
                        setSelectedStartup(st);
                        setShowChat(true);
                      }}
                    >
                      <Icon name="chat" size={16} color="black" />
                    </button>
                    <button
                      className="p-2 rounded bg-[#3B82F6] hover:bg-blue-700 text-white transition-colors"
                      title="Подробная информация о стартапе"
                      onClick={() => {
                        console.log('Открываем детали стартапа:', st.name);
                        setModalStartup(st);
                      }}
                    >
                      <Icon name="eye" size={16} color="white" />
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {/* Модальное окно для стартапа */}
      <Modal open={!!modalStartup} onClose={() => setModalStartup(null)}>
        {modalStartup && (
          <div className="text-gray-900">
            <h2 className="text-xl font-light mb-4 text-gray-900">Информация о стартапе</h2>
            <div className="space-y-3 text-sm font-light text-gray-900">
              <div className="flex items-center space-x-2"><Icon name="database" size={16} color="black" /><span><span className="font-medium">Название:</span> {modalStartup.name || '—'}</span></div>
              <div className="flex items-center space-x-2"><Icon name="email" size={16} color="black" /><span><span className="font-medium">Email:</span> {modalStartup.email || '—'}</span></div>
              <div className="flex items-center space-x-2"><Icon name="file" size={16} color="black" /><span><span className="font-medium">Описание:</span> {modalStartup.description || '—'}</span></div>
              <div className="flex items-center space-x-2"><Icon name="compass" size={16} color="black" /><span><span className="font-medium">Индустрия:</span> {modalStartup.industry || '—'}</span></div>
              <div className="flex items-center space-x-2"><Icon name="location" size={16} color="black" /><span><span className="font-medium">Локация:</span> {modalStartup.location || '—'}</span></div>
              <div className="flex items-center space-x-2"><Icon name="dashboard" size={16} color="black" /><span><span className="font-medium">Сумма финансирования:</span> {modalStartup.fundingAmount || '—'}</span></div>
              {modalStartup.stage && <div className="flex items-center space-x-2"><Icon name="award" size={16} color="black" /><span><span className="font-medium">Стадия:</span> {modalStartup.stage}</span></div>}
              {modalStartup.problem && <div className="flex items-center space-x-2"><Icon name="flag" size={16} color="black" /><span><span className="font-medium">Проблема:</span> {modalStartup.problem}</span></div>}
              {modalStartup.solution && <div className="flex items-center space-x-2"><Icon name="check" size={16} color="black" /><span><span className="font-medium">Решение:</span> {modalStartup.solution}</span></div>}
                              {modalStartup.team && (
                  <div className="flex items-center space-x-2">
                    <Icon name="user" size={16} color="black" />
                    <span><span className="font-medium">Команда:</span> {Array.isArray(modalStartup.team) 
                      ? modalStartup.team.map((member, index) => 
                          `${member.name || 'Без имени'}${member.role ? ` (${member.role})` : ''}`
                        ).join(', ')
                      : String(modalStartup.team)
                    }</span>
                  </div>
                )}
                {modalStartup.pitchDeckUrl && (
                  <div className="flex items-center space-x-2">
                    <Icon name="download" size={16} color="black" />
                    <span><span className="font-medium">Pitch Deck:</span> <a href={modalStartup.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">Скачать</a></span>
                  </div>
                )}
                {modalStartup.website && (
                  <div className="flex items-center space-x-2">
                    <Icon name="view" size={16} color="black" />
                    <span><span className="font-medium">Веб-сайт:</span> <a href={modalStartup.website} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">{modalStartup.website}</a></span>
                  </div>
                )}
            </div>
          </div>
        )}
      </Modal>

      {/* Новый чат в стиле WhatsApp */}
      {showChat && (
        <div className="fixed inset-0 z-50">
          <WhatsAppChat 
            startupData={selectedStartup} 
            onClose={() => setShowChat(false)}
          />
        </div>
      )}
    </div>
  );
} 