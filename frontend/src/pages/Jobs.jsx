import React, { useState, useEffect } from 'react';
import { useToast } from '../components/Shared/ToastProvider';

// Заглушка для вакансий (будет заменена на реальные данные)
const defaultJobs = [
  { id: 1, title: 'Frontend-разработчик', company: 'SilkGate', location: 'Remote', desc: 'React, Tailwind, опыт от 2 лет.' },
  { id: 2, title: 'Аналитик стартапов', company: 'VC Group', location: 'Москва', desc: 'Оценка проектов, работа с инвесторами.' },
];

// Получение профиля пользователя
const getUserProfile = () => {
  // Проверяем токены для разных ролей
  const investorToken = localStorage.getItem('investorToken');
  const startupToken = localStorage.getItem('startupToken');
  const userToken = localStorage.getItem('userToken');
  
  // Получаем данные профиля из localStorage
  const profileData = localStorage.getItem('userProfileData');
  let userProfile = null;
  
  if (profileData) {
    try {
      userProfile = JSON.parse(profileData);
    } catch (error) {
      console.error('Ошибка при парсинге профиля:', error);
    }
  }
  
  if (startupToken) {
    return {
      name: userProfile?.name || 'Иван Стартапер',
      email: 'startup@mail.com',
      role: 'startup',
      startupProfile: { name: 'MyStartup', email: 'contact@startup.com' },
      profile: userProfile
    };
  }
  if (investorToken) {
    return {
      name: userProfile?.name || 'Петр Инвестор',
      email: 'investor@mail.com',
      role: 'investor',
      profile: userProfile
    };
  }
  if (userToken) {
    return {
      name: userProfile?.name || 'Обычный пользователь',
      email: 'user@mail.com',
      role: 'user',
      profile: userProfile
    };
  }
  return null;
};

export default function Jobs() {
  const { showToast } = useToast();
  const [responded, setResponded] = useState({});
  const [openForm, setOpenForm] = useState(null);
  const [chooseType, setChooseType] = useState(null); // jobId для выбора типа отклика
  const [jobs, setJobs] = useState(defaultJobs);
  const [loading, setLoading] = useState(true);
  const user = getUserProfile();
  const isAuth = !!user;
  const isStartup = user && user.role === 'startup' && user.startupProfile;

  // Загрузка вакансий с бэкенда
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs/approved');
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          console.log('Используем заглушки вакансий');
          setJobs(defaultJobs);
        }
      } catch (error) {
        console.error('Ошибка загрузки вакансий:', error);
        setJobs(defaultJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-['Playfair_Display']">Работа</h1>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl font-['Inter']">Актуальные вакансии, возможность разместить свою вакансию и HR-партнёрство для компаний.</p>

        {/* Открытые вакансии */}
        <h2 className="text-2xl font-bold text-white mb-6 font-['Playfair_Display']">Открытые вакансии</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {jobs.map((j) => (
            <div key={j.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div className="text-lg font-semibold text-blue-600 mb-1 font-['Playfair_Display']">{j.title}</div>
              <div className="text-sm text-gray-600 mb-2 font-['Inter']">{j.company} — {j.location}</div>
              <div className="text-gray-700 mb-4 flex-1 font-['Inter'] leading-relaxed">{j.desc}</div>
              {isAuth ? (
                isStartup ? (
                  <>
                    <button
                      className="mt-auto px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition self-start disabled:opacity-60 font-['Inter']"
                      onClick={() => setChooseType(j.id)}
                      disabled={responded[j.id]}
                    >
                      {responded[j.id] ? 'Отклик отправлен' : 'Откликнуться'}
                    </button>
                    {chooseType === j.id && !responded[j.id] && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        <button
                          className="px-3 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 font-['Inter']"
                          onClick={() => handleRespond(j.id, 'user')}
                        >Отклик как {user.name}</button>
                        <button
                          className="px-3 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 font-['Inter']"
                          onClick={() => handleRespond(j.id, 'startup')}
                        >Отклик от компании</button>
                        <button
                          className="px-2 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 font-['Inter']"
                          onClick={() => setChooseType(null)}
                        >Отмена</button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    className="mt-auto px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition self-start disabled:opacity-60 font-['Inter']"
                    onClick={() => handleRespond(j.id, 'user')}
                    disabled={responded[j.id]}
                  >
                    {responded[j.id] ? 'Отклик отправлен' : 'Откликнуться'}
                  </button>
                )
              ) : (
                <>
                  <button
                    className="mt-auto px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition self-start font-['Inter']"
                    onClick={() => setOpenForm(j.id)}
                  >Откликнуться</button>
                  {openForm === j.id && (
                    <form onSubmit={handleFormSubmit} className="mt-4 bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
                      <input 
                        className="rounded-lg px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder-gray-500 font-['Inter']" 
                        placeholder="Ваше имя" 
                        defaultValue={user?.profile?.name || user?.name || ''}
                        required 
                      />
                      <input 
                        className="rounded-lg px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder-gray-500 font-['Inter']" 
                        placeholder="Email или телефон" 
                        defaultValue={user?.profile?.phone || user?.email || ''}
                        required 
                      />
                      <textarea 
                        className="rounded-lg px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder-gray-500 min-h-[60px] font-['Inter']" 
                        placeholder="Комментарий (необязательно)"
                        defaultValue={user?.profile?.bio ? `О себе: ${user.profile.bio}\n\nНавыки: ${user.profile.skills || 'Не указаны'}\n\nОпыт: ${user.profile.experience || 'Не указан'}` : ''}
                      />
                      <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition font-['Inter']">Отправить</button>
                    </form>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Разместить вакансию */}
        <h2 className="text-2xl font-bold text-white mb-6 font-['Playfair_Display']">Разместить вакансию</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 hover:shadow-xl transition-shadow duration-300">
          <div className="text-gray-700 mb-4 font-['Inter'] leading-relaxed">Хотите разместить вакансию? Оставьте заявку — мы свяжемся с вами!</div>
          <button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition font-['Inter']">Оставить заявку</button>
        </div>

        {/* HR-партнёрство */}
        <h2 className="text-2xl font-bold text-white mb-6 font-['Playfair_Display']">HR-партнёрство</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="text-gray-700 mb-4 font-['Inter'] leading-relaxed">SilkGate открыт к сотрудничеству с HR-агентствами и компаниями. Партнёрство — это доступ к лучшим кадрам и стартапам.</div>
          <button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition font-['Inter']">Стать партнёром</button>
        </div>
      </div>
    </div>
  );
} 