import React, { useState, useEffect } from 'react';
import { useToast } from '../components/Shared/ToastProvider';

function getStartupProfileProgress(s) {
  let total = 8, filled = 0;
  if (s.name) filled++;
  if (s.description) filled++;
  if (s.industry) filled++;
  if (s.stage) filled++;
  if (s.fundingAmount) filled++;
  if (s.links && (s.links.website || s.links.pitchDeck || s.links.prototype)) filled++;
  if (Array.isArray(s.team) && s.team.length > 0 && s.team[0].name) filled++;
  if (s.hasLegalEntity || s.hasRevenue || s.hasMVP) filled++;
  return Math.round((filled / total) * 100);
}

function getStartupProfileHints(s) {
  const hints = [];
  if (!s.name) hints.push('Заполните название');
  if (!s.description) hints.push('Заполните описание');
  if (!s.industry) hints.push('Укажите индустрию');
  if (!s.stage) hints.push('Укажите стадию');
  if (!s.fundingAmount) hints.push('Укажите сумму');
  if (!(s.links && (s.links.website || s.links.pitchDeck || s.links.prototype))) hints.push('Добавьте хотя бы одну ссылку');
  if (!(Array.isArray(s.team) && s.team.length > 0 && s.team[0].name)) hints.push('Добавьте хотя бы одного участника команды');
  if (!(s.hasLegalEntity || s.hasRevenue || s.hasMVP)) hints.push('Отметьте хотя бы одну галочку (юр.лицо, выручка, MVP)');
  return hints;
}

export default function StartupDashboard() {
  const [form, setForm] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    industry: '',
    stage: '',
    location: '',
    fundingAmount: '',
    fundingGoal: '',
    equityOffered: '',
    team: [{ name: '', role: '', linkedin: '' }],
    hasLegalEntity: false,
    hasRevenue: false,
    hasMVP: false,
    links: { website: '', pitchDeck: '', prototype: '' },
    status: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('main');
  const [editActiveTab, setEditActiveTab] = useState('main');

  const token = localStorage.getItem('startupToken');
  const toast = useToast();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.description) {
      toast.showToast('Название и описание обязательны', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/startups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка создания стартапа');
      toast.showToast('Стартап создан и отправлен на модерацию!', 'success');
      setForm({ name: '', description: '', industry: '', location: '', fundingAmount: '', pitchDeckUrl: '' });
      fetchProjects();
    } catch (err) {
      toast.showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (startup) => {
    setEditId(startup._id);
    setEditForm({ ...startup });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/startups/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка обновления');
      toast.showToast('Изменения сохранены!', 'success');
      setEditId(null);
      fetchProjects();
    } catch (err) {
      toast.showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setFetching(true);
    try {
      const res = await fetch('http://localhost:5000/api/startups/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setProjects(data);
      else setProjects([]);
    } catch {
      setProjects([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  function getTimeLeft(createdAt) {
    const deadline = new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const diff = deadline - now;
    if (diff <= 0) return null;
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    if (days > 0) return `Осталось ${days} дн. ${hours} ч.`;
    if (hours > 0) return `Осталось ${hours} ч. ${minutes} мин.`;
    return `Осталось ${minutes} мин.`;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#10182A] px-2 sm:px-0">
      <div className="w-full max-w-xs sm:max-w-2xl p-4 sm:p-8 bg-[#F5F6FA] rounded-lg shadow mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-[#10182A]">
          Дашборд стартапера
        </h2>
        {/* Прогресс-бар и подсказки — как раньше */}
        {projects.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="mb-1 text-xs sm:text-sm font-semibold">Заполненность профиля: {getStartupProfileProgress(projects[0])}%</div>
            <div className="w-full h-3 bg-gray-200 rounded">
              <div style={{width: getStartupProfileProgress(projects[0]) + '%'}} className="h-3 bg-blue-500 rounded transition-all"></div>
            </div>
            {getStartupProfileProgress(projects[0]) < 100 && (
              <ul className="mt-2 text-xs text-gray-600 list-disc list-inside">
                {getStartupProfileHints(projects[0]).map(hint => <li key={hint}>{hint}</li>)}
              </ul>
            )}
          </div>
        )}
        {/* Вкладки */}
        <div className="flex flex-col sm:flex-row mb-3 sm:mb-4 gap-1 sm:gap-2">
          <button type="button" className={`px-3 sm:px-4 py-2 rounded-t ${activeTab==='main' ? 'bg-white border-b-2 border-blue-500 font-bold' : 'bg-gray-200'}`} onClick={()=>setActiveTab('main')}>Основное</button>
          <button type="button" className={`px-3 sm:px-4 py-2 rounded-t ${activeTab==='team' ? 'bg-white border-b-2 border-blue-500 font-bold' : 'bg-gray-200'}`} onClick={()=>setActiveTab('team')}>Команда</button>
          <button type="button" className={`px-3 sm:px-4 py-2 rounded-t ${activeTab==='docs' ? 'bg-white border-b-2 border-blue-500 font-bold' : 'bg-gray-200'}`} onClick={()=>setActiveTab('docs')}>Документы/Ссылки</button>
        </div>
        <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
          {activeTab === 'main' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <input className="px-3 sm:px-4 py-2 border rounded flex-1 min-w-0 text-sm sm:text-base" name="name" value={form.name} onChange={handleChange} type="text" placeholder="Название*" />
              <input className="px-3 sm:px-4 py-2 border rounded flex-1 min-w-0 text-sm sm:text-base" name="industry" value={form.industry} onChange={handleChange} type="text" placeholder="Индустрия" />
              <input className="px-3 sm:px-4 py-2 border rounded flex-1 min-w-0 text-sm sm:text-base" name="location" value={form.location} onChange={handleChange} type="text" placeholder="Локация" />
              <input className="px-3 sm:px-4 py-2 border rounded flex-1 min-w-0 text-sm sm:text-base" name="fundingAmount" value={form.fundingAmount} onChange={handleChange} type="number" placeholder="Запрашиваемая сумма" />
              <input className="px-3 sm:px-4 py-2 border rounded flex-1 min-w-0 text-sm sm:text-base" name="stage" value={form.stage} onChange={handleChange} type="text" placeholder="Стадия (идея, MVP, ... )" />
              <input className="px-3 sm:px-4 py-2 border rounded flex-1 min-w-0 text-sm sm:text-base" name="equityOffered" value={form.equityOffered} onChange={handleChange} type="number" placeholder="Доля, %" />
              <textarea className="w-full mb-3 sm:mb-4 px-3 sm:px-4 py-2 border rounded md:col-span-2 text-sm sm:text-base" name="description" value={form.description} onChange={handleChange} placeholder="Описание проекта" rows={4} />
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2 md:col-span-2">
                <label className="text-xs sm:text-base"><input type="checkbox" name="hasRevenue" checked={form.hasRevenue} onChange={e => setForm(f => ({...f, hasRevenue: e.target.checked}))} /> Есть выручка</label>
                <label className="text-xs sm:text-base"><input type="checkbox" name="hasMVP" checked={form.hasMVP} onChange={e => setForm(f => ({...f, hasMVP: e.target.checked}))} /> Есть MVP</label>
                <label className="text-xs sm:text-base"><input type="checkbox" name="hasLegalEntity" checked={form.hasLegalEntity} onChange={e => setForm(f => ({...f, hasLegalEntity: e.target.checked}))} /> Юр. лицо</label>
              </div>
            </div>
          )}
          {activeTab === 'team' && (
            <div className="flex flex-col gap-2 mb-2 mt-4">
              <div className="font-semibold mb-1 text-sm sm:text-base">Команда:</div>
              {form.team.map((m, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center gap-2 w-full">
                  <input className="px-2 py-1 border rounded flex-1 min-w-0 text-sm sm:text-base" value={m.name} onChange={e => setForm(f => {const t=[...f.team];t[i].name=e.target.value;return {...f, team:t};})} placeholder="Имя" />
                  <input className="px-2 py-1 border rounded flex-1 min-w-0 text-sm sm:text-base" value={m.role} onChange={e => setForm(f => {const t=[...f.team];t[i].role=e.target.value;return {...f, team:t};})} placeholder="Роль" />
                  <input className="px-2 py-1 border rounded flex-1 min-w-0 text-sm sm:text-base" value={m.linkedin} onChange={e => setForm(f => {const t=[...f.team];t[i].linkedin=e.target.value;return {...f, team:t};})} placeholder="LinkedIn" />
                  <button type="button" className="text-xs text-red-600 px-2 py-1 border border-red-200 rounded hover:bg-red-50 ml-0 sm:ml-1" style={{height:32}} onClick={() => setForm(f => ({...f, team: f.team.filter((_,j)=>j!==i)}))}>✕</button>
                </div>
              ))}
              <button type="button" className="text-xs text-blue-700 mt-2 self-start" onClick={() => setForm(f => ({...f, team: [...f.team, {name:'',role:'',linkedin:''}]}))}>Добавить участника</button>
            </div>
          )}
          {activeTab === 'docs' && (
            <div className="flex flex-col gap-2 mb-2 mt-4">
              <div className="font-semibold mb-1 text-sm sm:text-base">Ссылки:</div>
              <input className="px-3 sm:px-4 py-2 border rounded text-sm sm:text-base" name="website" value={form.links?.website||''} onChange={e => setForm(f => ({...f, links: {...f.links, website: e.target.value}}))} type="text" placeholder="Сайт" />
              <input className="px-3 sm:px-4 py-2 border rounded text-sm sm:text-base" name="pitchDeck" value={form.links?.pitchDeck||''} onChange={e => setForm(f => ({...f, links: {...f.links, pitchDeck: e.target.value}}))} type="text" placeholder="Pitch Deck" />
              <input className="px-3 sm:px-4 py-2 border rounded text-sm sm:text-base" name="prototype" value={form.links?.prototype||''} onChange={e => setForm(f => ({...f, links: {...f.links, prototype: e.target.value}}))} type="text" placeholder="Прототип (ссылка)" />
            </div>
          )}
          {/* {error && <div className="mb-2 text-red-600 text-center">{error}</div>} */}
          {/* {success && <div className="mb-2 text-green-600 text-center">{success}</div>} */}
          <button className="w-full py-2 bg-[#FFD700] text-[#10182A] rounded font-semibold hover:bg-yellow-400 transition text-sm sm:text-base" type="submit" disabled={loading}>
            {loading ? 'Создание...' : 'Создать стартап'}
          </button>
        </form>
        <h3 className="text-base sm:text-lg font-semibold mb-2">Мои стартапы</h3>
        {fetching ? (
          <div className="text-gray-400 text-center">Загрузка...</div>
        ) : projects.length === 0 ? (
          <div className="text-gray-400 text-center">У вас пока нет проектов.</div>
        ) : (
          <ul className="divide-y">
            {projects.map(s => (
              <li key={s._id} className="py-3">
                {editId === s._id ? (
                  <>
                    <div className="flex mb-4 gap-2">
                      <button type="button" className={`px-4 py-2 rounded-t ${editActiveTab==='main' ? 'bg-white border-b-2 border-blue-500 font-bold' : 'bg-gray-200'}`} onClick={()=>setEditActiveTab('main')}>Основное</button>
                      <button type="button" className={`px-4 py-2 rounded-t ${editActiveTab==='team' ? 'bg-white border-b-2 border-blue-500 font-bold' : 'bg-gray-200'}`} onClick={()=>setEditActiveTab('team')}>Команда</button>
                      <button type="button" className={`px-4 py-2 rounded-t ${editActiveTab==='docs' ? 'bg-white border-b-2 border-blue-500 font-bold' : 'bg-gray-200'}`} onClick={()=>setEditActiveTab('docs')}>Документы/Ссылки</button>
                    </div>
                    <form onSubmit={handleEditSubmit} className="mb-2">
                      {editActiveTab === 'main' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <input className="px-4 py-2 border rounded flex-1 min-w-[220px]" name="name" value={editForm.name} onChange={handleEditChange} type="text" placeholder="Название*" />
                          <input className="px-4 py-2 border rounded flex-1 min-w-[220px]" name="industry" value={editForm.industry} onChange={handleEditChange} type="text" placeholder="Индустрия" />
                          <input className="px-4 py-2 border rounded flex-1 min-w-[220px]" name="location" value={editForm.location} onChange={handleEditChange} type="text" placeholder="Локация" />
                          <input className="px-4 py-2 border rounded flex-1 min-w-[220px]" name="fundingAmount" value={editForm.fundingAmount} onChange={handleEditChange} type="number" placeholder="Сумма" />
                          <input className="px-4 py-2 border rounded flex-1 min-w-[220px]" name="stage" value={editForm.stage} onChange={handleEditChange} type="text" placeholder="Стадия (идея, MVP, ... )" />
                          <input className="px-4 py-2 border rounded flex-1 min-w-[220px]" name="equityOffered" value={editForm.equityOffered} onChange={handleEditChange} type="number" placeholder="Доля, %" />
                          <textarea className="w-full mb-4 px-4 py-2 border rounded md:col-span-2" name="description" value={editForm.description} onChange={handleEditChange} placeholder="Описание проекта" rows={4} />
                          <div className="flex flex-row gap-4 mb-2 md:col-span-2">
                            <label><input type="checkbox" name="hasRevenue" checked={editForm.hasRevenue} onChange={e => setEditForm(f => ({...f, hasRevenue: e.target.checked}))} /> Есть выручка</label>
                            <label><input type="checkbox" name="hasMVP" checked={editForm.hasMVP} onChange={e => setEditForm(f => ({...f, hasMVP: e.target.checked}))} /> Есть MVP</label>
                            <label><input type="checkbox" name="hasLegalEntity" checked={editForm.hasLegalEntity} onChange={e => setEditForm(f => ({...f, hasLegalEntity: e.target.checked}))} /> Юр. лицо</label>
                          </div>
                        </div>
                      )}
                      {editActiveTab === 'team' && (
                        <div className="flex flex-col gap-2 mb-2 mt-4">
                          <div className="font-semibold mb-1">Команда:</div>
                          {(editForm.team||[]).map((m,i)=>(
                            <div key={i} className="flex flex-row items-center gap-2 w-full">
                              <input className="px-2 py-1 border rounded flex-1 min-w-0" value={m.name} onChange={e => setEditForm(f => {const t=[...f.team];t[i].name=e.target.value;return {...f, team:t};})} placeholder="Имя" />
                              <input className="px-2 py-1 border rounded flex-1 min-w-0" value={m.role} onChange={e => setEditForm(f => {const t=[...f.team];t[i].role=e.target.value;return {...f, team:t};})} placeholder="Роль" />
                              <input className="px-2 py-1 border rounded flex-1 min-w-0" value={m.linkedin} onChange={e => setEditForm(f => {const t=[...f.team];t[i].linkedin=e.target.value;return {...f, team:t};})} placeholder="LinkedIn" />
                              <button type="button" className="text-xs text-red-600 px-2 py-1 border border-red-200 rounded hover:bg-red-50 ml-1" style={{height:32}} onClick={() => setEditForm(f => ({...f, team: f.team.filter((_,j)=>j!==i)}))}>Удалить</button>
                            </div>
                          ))}
                          <button type="button" className="text-xs text-blue-700 mt-2 self-start" onClick={() => setEditForm(f => ({...f, team: [...f.team, {name:'',role:'',linkedin:''}]}))}>Добавить участника</button>
                        </div>
                      )}
                      {editActiveTab === 'docs' && (
                        <div className="flex flex-col gap-2 mb-2 mt-4">
                          <div className="font-semibold mb-1">Ссылки:</div>
                          <input className="px-4 py-2 border rounded" name="website" value={editForm.links?.website||''} onChange={e => setEditForm(f => ({...f, links: {...f.links, website: e.target.value}}))} type="text" placeholder="Сайт" />
                          <input className="px-4 py-2 border rounded" name="pitchDeck" value={editForm.links?.pitchDeck||''} onChange={e => setEditForm(f => ({...f, links: {...f.links, pitchDeck: e.target.value}}))} type="text" placeholder="Pitch Deck" />
                          <input className="px-4 py-2 border rounded" name="prototype" value={editForm.links?.prototype||''} onChange={e => setEditForm(f => ({...f, links: {...f.links, prototype: e.target.value}}))} type="text" placeholder="Прототип (ссылка)" />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button className="px-4 py-1 bg-blue-700 text-white rounded" type="submit" disabled={loading}>{loading ? 'Сохр...' : 'Сохранить'}</button>
                        <button className="px-4 py-1 bg-gray-300 text-gray-800 rounded" type="button" onClick={() => setEditId(null)}>Отмена</button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="font-bold">{s.name}</div>
                    <div className="text-gray-600 text-sm mb-1">{s.description}</div>
                    <div className="text-xs text-gray-400 mb-1">Статус: {s.status}</div>
                    {(!s.pitchDeckUrl || s.pitchDeckUrl === '') && s.status !== 'archived' && (
                      <>
                        <div className="text-xs text-yellow-700 bg-yellow-100 border-l-4 border-yellow-400 p-2 mb-1 font-semibold flex items-center gap-2">
                          <span role="img" aria-label="warning">⚠️</span>
                          До автоматического переноса стартапа в архив осталось: {getTimeLeft(s.createdAt) ? getTimeLeft(s.createdAt) : 'меньше минуты'}
                        </div>
                        <div className="text-xs text-gray-700 mb-2">
                          Загрузите pitch deck, чтобы ваш проект остался активным.
                        </div>
                      </>
                    )}
                    <div><b>Стадия:</b> {s.stage}</div>
                    <div><b>Доля:</b> {s.equityOffered}%</div>
                    <div><b>Описание:</b> {s.description}</div>
                    <div><b>Юр. лицо:</b> {s.hasLegalEntity ? 'Да' : 'Нет'}</div>
                    <div><b>Есть выручка:</b> {s.hasRevenue ? 'Да' : 'Нет'}</div>
                    <div><b>Есть MVP:</b> {s.hasMVP ? 'Да' : 'Нет'}</div>
                    <div><b>Ссылки:</b> {s.links?.website && <a href={s.links.website} target="_blank" rel="noopener noreferrer">{s.links.website.replace(/^https?:\/\//, '')}</a>} {s.links?.pitchDeck && <a href={s.links.pitchDeck} target="_blank" rel="noopener noreferrer">{s.links.pitchDeck.replace(/^https?:\/\//, '')}</a>} {s.links?.prototype && <a href={s.links.prototype} target="_blank" rel="noopener noreferrer">{s.links.prototype.replace(/^https?:\/\//, '')}</a>}</div>
                    <div><b>Команда:</b> <ul>{(s.team||[]).map((m,i)=>(<li key={i}>{m.name} — {m.role} {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}</li>))}</ul></div>
                    <button className="px-3 py-1 bg-[#FFD700] text-[#10182A] rounded text-xs font-semibold hover:bg-yellow-400 transition" onClick={() => handleEdit(s)}>
                      Редактировать
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 