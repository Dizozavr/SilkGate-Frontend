import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Shared/ToastProvider';

function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('investorToken');
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}

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

export default function InvestorDashboard() {
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
      setStartups(await res.json());
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
    <div className="min-h-screen bg-[#10182A] px-2 sm:px-0 py-4 sm:py-8">
      {/* Профиль инвестора */}
      <div className="max-w-2xl mx-auto mb-6 sm:mb-8 p-4 sm:p-6 bg-[#F5F6FA] rounded-lg shadow relative">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-[#10182A]">
            Мой профиль
          </h3>
          <button
            onClick={handleEditOpen}
            className="text-gray-500 hover:text-[#FFD700] hover:underline text-xs font-semibold transition px-3 py-1 rounded absolute right-4 bottom-4"
            style={{ minWidth: 'auto' }}
          >
            Редактировать
          </button>
        </div>
        {(!profile) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 text-xs sm:text-sm opacity-60">
            <div><b>Имя:</b> Murod</div>
            <div><b>Email:</b> dizozavr@gmail.com</div>
            <div><b>Тип:</b> Ангел</div>
            <div><b>Инвестиционный диапазон:</b> 20000 — 100000</div>
            <div><b>Интересы:</b> Fintech, AI, SaaS</div>
            <div><b>Стадии:</b> Seed, Series A</div>
            <div><b>Гео-фокус:</b> Казахстан, Европа</div>
            <div><b>Тип сделки:</b> Equity, SAFE</div>
            <div><b>Публичный профиль:</b> Да</div>
            <div className="md:col-span-2"><b>Биография:</b> Опытный инвестор, интересуюсь инновациями и IT.</div>
            <div><b>LinkedIn:</b> <a href="https://linkedin.com/in/example" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">linkedin.com/in/example</a></div>
            <div><b>Telegram:</b> <a href="https://t.me/example" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@example</a></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 text-xs sm:text-sm">
            <div><b>Имя:</b> {profile.name}</div>
            <div><b>Email:</b> {profile.email}</div>
            <div><b>Тип:</b> {profile.investorType || '—'}</div>
            <div><b>Инвестиционный диапазон:</b> {profile.investmentRange ? `${profile.investmentRange.min} — ${profile.investmentRange.max}` : '—'}</div>
            <div><b>Интересы:</b> {(profile.interests || []).join(', ') || '—'}</div>
            <div><b>Стадии:</b> {(profile.preferredStages || []).join(', ') || '—'}</div>
            <div><b>Гео-фокус:</b> {(profile.geoFocus || []).join(', ') || '—'}</div>
            <div><b>Тип сделки:</b> {(profile.dealType || []).join(', ') || '—'}</div>
            <div><b>Публичный профиль:</b> {profile.publicProfile ? 'Да' : 'Нет'}</div>
            <div className="md:col-span-2"><b>Биография:</b> {profile.bio || '—'}</div>
            <div><b>LinkedIn:</b> {profile.contactLinks?.linkedin ? <a href={profile.contactLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.contactLinks.linkedin}</a> : '—'}</div>
            <div><b>Telegram:</b> {profile.contactLinks?.telegram ? <a href={`https://t.me/${profile.contactLinks.telegram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.contactLinks.telegram}</a> : '—'}</div>
          </div>
        )}
      </div>
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        {editForm && (
          <form onSubmit={handleEditSubmit}>
            <h3 className="text-lg font-bold mb-4">Редактировать профиль</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <input className="px-3 py-2 border rounded mb-2" name="name" value={editForm.name} onChange={handleEditChange} type="text" placeholder="Имя*" />
              <input className="px-3 py-2 border rounded mb-2" name="location" value={editForm.location} onChange={handleEditChange} type="text" placeholder="Локация" />
              <input className="px-3 py-2 border rounded mb-2" name="investorType" value={editForm.investorType} onChange={handleEditChange} type="text" placeholder="Тип инвестора" />
              <div className="flex gap-2 mb-2">
                <input className="w-1/2 px-3 py-2 border rounded" name="investmentRangeMin" value={editForm.investmentRangeMin} onChange={handleEditChange} type="number" placeholder="Мин. инвестиции" />
                <input className="w-1/2 px-3 py-2 border rounded" name="investmentRangeMax" value={editForm.investmentRangeMax} onChange={handleEditChange} type="number" placeholder="Макс. инвестиции" />
              </div>
              <input className="px-3 py-2 border rounded mb-2" name="interests" value={editForm.interests} onChange={handleEditChange} type="text" placeholder="Интересы (через запятую)" />
              <input className="px-3 py-2 border rounded mb-2" name="preferredStages" value={editForm.preferredStages} onChange={handleEditChange} type="text" placeholder="Стадии (через запятую)" />
              <input className="px-3 py-2 border rounded mb-2" name="geoFocus" value={editForm.geoFocus} onChange={handleEditChange} type="text" placeholder="Гео-фокус (через запятую)" />
              <input className="px-3 py-2 border rounded mb-2" name="dealType" value={editForm.dealType} onChange={handleEditChange} type="text" placeholder="Тип сделки (через запятую)" />
              <label className="flex items-center mb-2">
                <input name="publicProfile" type="checkbox" checked={editForm.publicProfile} onChange={handleEditChange} className="mr-2" /> Публичный профиль
              </label>
              <input className="px-3 py-2 border rounded mb-2" name="linkedin" value={editForm.linkedin} onChange={handleEditChange} type="text" placeholder="Ссылка на LinkedIn" />
              <input className="px-3 py-2 border rounded mb-2" name="telegram" value={editForm.telegram} onChange={handleEditChange} type="text" placeholder="Telegram (@username)" />
            </div>
            <textarea className="w-full px-3 py-2 border rounded mb-2" name="bio" value={editForm.bio} onChange={handleEditChange} placeholder="Краткая биография" />
            {/* {editError && <div className="text-red-600 mb-2">{editError}</div>} */}
            <div className="flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Отмена</button>
              <button type="submit" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900" disabled={editLoading}>{editLoading ? 'Сохранение...' : 'Сохранить'}</button>
            </div>
          </form>
        )}
      </Modal>
      {/* Фильтры и поиск */}
      <div className="max-w-2xl mx-auto mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch">
        <select
          className="px-3 py-2 border rounded text-xs sm:text-base w-full sm:w-auto"
          value={filter.industry}
          onChange={e => setFilter(f => ({ ...f, industry: e.target.value }))}
        >
          <option value="">Все индустрии</option>
          {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
        </select>
        <input
          className="px-3 py-2 border rounded text-xs sm:text-base w-full sm:w-auto"
          type="text"
          placeholder="Поиск по названию"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ minWidth: '220px', flexGrow: 1 }}
        />
        <button
          className="px-3 py-2 bg-[#FFD700] text-[#10182A] rounded font-semibold hover:bg-yellow-400 transition text-xs sm:text-base w-full sm:w-auto"
          style={{ minWidth: '90px', height: '40px', alignSelf: 'center' }}
          onClick={() => { setFilter({ industry: '', location: '' }); setSearch(''); }}
          type="button"
        >
          Сбросить
        </button>
      </div>
      {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-[#F5F6FA] rounded-lg shadow overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100 text-[#10182A]">
                <th className="p-2 border">Название</th>
                <th className="p-2 border">Описание</th>
                <th className="p-2 border">Индустрия</th>
                <th className="p-2 border">Сумма</th>
                <th className="p-2 border">Pitch Deck</th>
                <th className="p-2 border">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredStartups().map((st, idx) => (
                <tr key={st._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F6FA]'}>
                  <td className="p-2 border text-[#10182A]">
                    <button
                      onClick={() => setModalStartup(st)}
                      className="text-blue-700 hover:underline font-semibold text-left w-full text-lg"
                      style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
                    >
                      {st.name}
                    </button>
                  </td>
                  <td className="p-2 border text-[#10182A]">{st.description}</td>
                  <td className="p-2 border text-[#10182A]">{st.industry}</td>
                  <td className="p-2 border text-[#10182A]">{st.fundingAmount}</td>
                  <td className="p-2 border text-[#10182A]">
                    {st.pitchDeckUrl ? (
                      <a href={st.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Смотреть</a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="p-2 border flex flex-wrap gap-2 items-center justify-center">
                    <button
                      className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-[#10182A] text-lg"
                      title="Добавить в избранное"
                      onClick={() => handleInterested(st._id)}
                      style={{ background: interested[st._id] ? '#FFD700' : undefined, color: interested[st._id] ? '#10182A' : undefined }}
                    >⭐</button>
                    <button
                      className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-[#10182A] text-lg"
                      title="Скрыть проект"
                      onClick={() => toast.showToast('Проект скрыт (заглушка)', 'info')}
                    >👎</button>
                    <button
                      className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-[#10182A] text-lg"
                      title="Начать чат со стартапером"
                      onClick={() => toast.showToast('Окно чата (заглушка)', 'info')}
                    >💬</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={!!modalStartup} onClose={() => setModalStartup(null)}>
        {modalStartup && (
          <div>
            <h3 className="text-2xl font-bold mb-4">{modalStartup.name}</h3>
            {Object.entries(modalStartup)
              .filter(([key]) => !['_id', '__v', 'password', 'createdAt', 'updatedAt'].includes(key))
              .map(([key, value]) => (
                <div className="mb-2" key={key}>
                  <b>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:</b> {' '}
                  {Array.isArray(value) ? (value.length ? value.join(', ') : '—') :
                    typeof value === 'object' && value !== null ? (
                      Object.values(value).length ? JSON.stringify(value) : '—'
                    ) :
                    (value || value === 0 ? value : '—')}
                </div>
              ))}
            <div className="mt-4 flex justify-end">
              <button onClick={() => setModalStartup(null)} className="px-4 py-2 bg-[#FFD700] text-[#10182A] rounded hover:bg-yellow-400 font-semibold transition">
                Закрыть
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 