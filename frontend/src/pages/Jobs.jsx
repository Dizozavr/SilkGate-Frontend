import React, { useState } from 'react';
import { useToast } from '../components/Shared/ToastProvider';

const jobs = [
  { id: 1, title: 'Frontend-разработчик', company: 'SilkGate', location: 'Remote', desc: 'React, Tailwind, опыт от 2 лет.' },
  { id: 2, title: 'Аналитик стартапов', company: 'VC Group', location: 'Москва', desc: 'Оценка проектов, работа с инвесторами.' },
];

// Эмуляция профиля пользователя (MVP)
const getUserProfile = () => {
  // В реальном проекте брать из backend или localStorage
  const investorToken = localStorage.getItem('investorToken');
  const startupToken = localStorage.getItem('startupToken');
  if (startupToken) {
    return {
      name: 'Иван Стартапер',
      email: 'startup@mail.com',
      role: 'startup',
      startupProfile: { name: 'MyStartup', email: 'contact@startup.com' },
    };
  }
  if (investorToken) {
    return {
      name: 'Петр Инвестор',
      email: 'investor@mail.com',
      role: 'investor',
    };
  }
  return null;
};

export default function Jobs() {
  const { showToast } = useToast();
  const [responded, setResponded] = useState({});
  const [openForm, setOpenForm] = useState(null);
  const [chooseType, setChooseType] = useState(null); // jobId для выбора типа отклика
  const user = getUserProfile();
  const isAuth = !!user;
  const isStartup = user && user.role === 'startup' && user.startupProfile;

  function handleRespond(id, fromType) {
    setResponded(r => ({ ...r, [id]: true }));
    setChooseType(null);
    showToast(`Отклик отправлен${fromType === 'startup' ? ' от компании' : ''}!`, 'success');
    // Здесь можно добавить отправку на backend
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setOpenForm(null);
    showToast('Отклик отправлен!', 'success');
  }

  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Работа</h1>
      <p className="text-lg text-gray-300 mb-10 max-w-2xl">Актуальные вакансии, возможность разместить свою вакансию и HR-партнёрство для компаний.</p>

      {/* Открытые вакансии */}
      <h2 className="text-2xl font-bold text-white mb-4">Открытые вакансии</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {jobs.map((j) => (
          <div key={j.id} className="bg-[#1A2238] rounded-2xl shadow-lg p-6 flex flex-col">
            <div className="text-lg font-semibold text-[#FFD700] mb-1">{j.title}</div>
            <div className="text-xs text-gray-400 mb-2">{j.company} — {j.location}</div>
            <div className="text-gray-200 mb-4 flex-1">{j.desc}</div>
            {isAuth ? (
              isStartup ? (
                <>
                  <button
                    className="mt-auto px-4 py-2 rounded-lg bg-[#FFD700] text-[#10182A] font-semibold hover:bg-yellow-400 transition self-start disabled:opacity-60"
                    onClick={() => setChooseType(j.id)}
                    disabled={responded[j.id]}
                  >
                    {responded[j.id] ? 'Отклик отправлен' : 'Откликнуться'}
                  </button>
                  {chooseType === j.id && !responded[j.id] && (
                    <div className="mt-3 flex gap-2">
                      <button
                        className="px-3 py-2 rounded bg-[#FFD700] text-[#10182A] font-semibold hover:bg-yellow-400"
                        onClick={() => handleRespond(j.id, 'user')}
                      >Отклик как {user.name}</button>
                      <button
                        className="px-3 py-2 rounded bg-[#FFD700] text-[#10182A] font-semibold hover:bg-yellow-400"
                        onClick={() => handleRespond(j.id, 'startup')}
                      >Отклик от компании</button>
                      <button
                        className="px-2 py-2 rounded bg-[#232B45] text-white font-semibold hover:bg-[#1A2238]"
                        onClick={() => setChooseType(null)}
                      >Отмена</button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  className="mt-auto px-4 py-2 rounded-lg bg-[#FFD700] text-[#10182A] font-semibold hover:bg-yellow-400 transition self-start disabled:opacity-60"
                  onClick={() => handleRespond(j.id, 'user')}
                  disabled={responded[j.id]}
                >
                  {responded[j.id] ? 'Отклик отправлен' : 'Откликнуться'}
                </button>
              )
            ) : (
              <>
                <button
                  className="mt-auto px-4 py-2 rounded-lg bg-[#FFD700] text-[#10182A] font-semibold hover:bg-yellow-400 transition self-start"
                  onClick={() => setOpenForm(j.id)}
                >Откликнуться</button>
                {openForm === j.id && (
                  <form onSubmit={handleFormSubmit} className="mt-4 bg-[#232B45] rounded-xl p-4 flex flex-col gap-2">
                    <input className="rounded px-3 py-2 bg-[#1A2238] text-white placeholder-gray-400" placeholder="Ваше имя" required />
                    <input className="rounded px-3 py-2 bg-[#1A2238] text-white placeholder-gray-400" placeholder="Email или телефон" required />
                    <textarea className="rounded px-3 py-2 bg-[#1A2238] text-white placeholder-gray-400 min-h-[60px]" placeholder="Комментарий (необязательно)" />
                    <button type="submit" className="px-4 py-2 rounded-lg bg-[#FFD700] text-[#10182A] font-semibold hover:bg-yellow-400 transition">Отправить</button>
                  </form>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Разместить вакансию */}
      <h2 className="text-2xl font-bold text-white mb-4">Разместить вакансию</h2>
      <div className="bg-[#232B45] rounded-2xl shadow p-6 mb-12">
        <div className="text-gray-200 mb-2">Хотите разместить вакансию? Оставьте заявку — мы свяжемся с вами!</div>
        <button className="px-4 py-2 rounded-lg bg-[#FFD700] text-[#10182A] font-semibold hover:bg-yellow-400 transition">Оставить заявку</button>
      </div>

      {/* HR-партнёрство */}
      <h2 className="text-2xl font-bold text-white mb-4">HR-партнёрство</h2>
      <div className="bg-[#232B45] rounded-2xl shadow p-6">
        <div className="text-gray-200 mb-2">SilkGate открыт к сотрудничеству с HR-агентствами и компаниями. Партнёрство — это доступ к лучшим кадрам и стартапам.</div>
        <button className="px-4 py-2 rounded-lg bg-[#FFD700] text-[#10182A] font-semibold hover:bg-yellow-400 transition">Стать партнёром</button>
      </div>
    </div>
  );
} 