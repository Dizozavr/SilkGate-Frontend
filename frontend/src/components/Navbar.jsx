import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Shared/AuthContext';
import Modal from './Shared/Modal';
import LoginForm from './Auth/LoginForm';

const Navbar = () => {
  const { user, role, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const [showJobsDropdown, setShowJobsDropdown] = useState(false);
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Для принудительного перерендера
  const profileMenuRef = useRef(null);
  
  // Таймеры для задержки скрытия выпадающих меню
  const [productsTimeout, setProductsTimeout] = useState(null);
  const [educationTimeout, setEducationTimeout] = useState(null);
  const [jobsTimeout, setJobsTimeout] = useState(null);
  const [resourcesTimeout, setResourcesTimeout] = useState(null);

  // Проверяем наличие любого токена
  const hasAnyToken = localStorage.getItem('startupToken') || 
                     localStorage.getItem('investorToken') || 
                     localStorage.getItem('adminToken') || 
                     localStorage.getItem('userToken');

  // Отслеживаем изменения в localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authUpdate', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate('/');
  }

  const handleLoginClick = () => {
    console.log('Кнопка Войти нажата!');
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (role) => {
    console.log('Успешный вход, роль:', role);
    setShowLoginModal(false);
    // Принудительно обновляем AuthContext
    setTimeout(() => {
      window.dispatchEvent(new Event('authUpdate'));
    }, 100);
  };

  const handleForgotPassword = () => {
    setShowLoginModal(false);
    navigate('/forgot-password');
  };

  const handleRegister = () => {
    setShowLoginModal(false);
    navigate('/register');
  };

  console.log('Navbar render - hasAnyToken:', hasAnyToken, 'showLoginModal:', showLoginModal);

  return (
    <>
      <nav className="bg-[#10182A] text-white px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Логотип */}
                            <Link to="/" className="flex items-center space-x-2">
                    <img src="/logo-icon-new.png" alt="SilkGate" className="w-8 h-8" />
                    <span className="text-[#FFD700] font-bold text-xl">SilkGate</span>
                  </Link>

          {/* Навигационные ссылки справа */}
          <div className="hidden md:flex items-center space-x-8 ml-auto mr-8">
            {/* Продукты с выпадающим меню */}
            <div className="relative">
              <button
                onMouseEnter={() => {
                  if (productsTimeout) clearTimeout(productsTimeout);
                  setShowProductsDropdown(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => setShowProductsDropdown(false), 300);
                  setProductsTimeout(timeout);
                }}
                className="hover:text-[#FFD700] transition flex items-center"
              >
                Проекты
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showProductsDropdown && (
                <div
                  onMouseEnter={() => {
                    if (productsTimeout) clearTimeout(productsTimeout);
                    setShowProductsDropdown(true);
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => setShowProductsDropdown(false), 300);
                    setProductsTimeout(timeout);
                  }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  <Link to="/projects" className="block px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">Каталог</Link>
                  <Link to="/news" className="block px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">Новости</Link>
                  <Link to="/pricing" className="block px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">Тарифы</Link>
                </div>
              )}
            </div>

            {/* Образование с выпадающим меню */}
            <div className="relative">
              <button
                onMouseEnter={() => {
                  if (educationTimeout) clearTimeout(educationTimeout);
                  setShowEducationDropdown(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => setShowEducationDropdown(false), 300);
                  setEducationTimeout(timeout);
                }}
                className="hover:text-[#FFD700] transition flex items-center"
              >
                Образование
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showEducationDropdown && (
                <div
                  onMouseEnter={() => {
                    if (educationTimeout) clearTimeout(educationTimeout);
                    setShowEducationDropdown(true);
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => setShowEducationDropdown(false), 300);
                    setEducationTimeout(timeout);
                  }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  <Link to="/education" className="block px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">Семинары</Link>
                  <Link to="/education/calendar" className="block px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">Календарь</Link>
                </div>
              )}
            </div>

            {/* Работа с выпадающим меню */}
            <div className="relative">
              <button
                onMouseEnter={() => {
                  if (jobsTimeout) clearTimeout(jobsTimeout);
                  setShowJobsDropdown(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => setShowJobsDropdown(false), 300);
                  setJobsTimeout(timeout);
                }}
                className="hover:text-[#FFD700] transition flex items-center"
              >
                Работа
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showJobsDropdown && (
                <div
                  onMouseEnter={() => {
                    if (jobsTimeout) clearTimeout(jobsTimeout);
                    setShowJobsDropdown(true);
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => setShowJobsDropdown(false), 300);
                    setJobsTimeout(timeout);
                  }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  <Link to="/jobs" className="block px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">Вакансии</Link>
                  <Link to="/jobs/post" className="block px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">Разместить вакансию</Link>
                  <Link to="/jobs/hr" className="block px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">HR-партнер</Link>
                </div>
              )}
            </div>

            {/* Ресурсы с выпадающим меню */}
            <div className="relative">
              <button
                onMouseEnter={() => {
                  if (resourcesTimeout) clearTimeout(resourcesTimeout);
                  setShowResourcesDropdown(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => setShowResourcesDropdown(false), 300);
                  setResourcesTimeout(timeout);
                }}
                className="hover:text-[#FFD700] transition flex items-center"
              >
                Ресурсы
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showResourcesDropdown && (
                <div
                  onMouseEnter={() => {
                    if (resourcesTimeout) clearTimeout(resourcesTimeout);
                    setShowResourcesDropdown(true);
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => setShowResourcesDropdown(false), 300);
                    setResourcesTimeout(timeout);
                  }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  <Link to="/docs" className="block px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">Документация</Link>
                  <Link to="/faq" className="block px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">FAQ</Link>
                  <Link to="/about" className="block px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">О нас</Link>
                </div>
              )}
            </div>
          </div>

          {/* Кнопка Войти/Профиль */}
          {hasAnyToken ? (
            <div className="flex items-center space-x-4">
              {/* Кнопка чата - только для инвесторов и админов */}
              {(role === 'investor' || role === 'admin') && (
                <Link
                  to="/chat"
                  className="relative p-2 text-[#FFD700] hover:text-white transition-colors"
                  title="Сообщения"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {/* Индикатор непрочитанных сообщений */}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              )}

              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="px-4 sm:px-5 py-2 rounded-lg font-semibold text-[#FFD700] border-2 border-[#FFD700] bg-transparent hover:bg-[#FFD700] hover:text-[#1a365d] transition text-sm sm:text-base shadow"
                >
                  <span>{user?.name || user?.email || 'Профиль'}</span>
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {/* Кнопка чата в меню профиля для стартапов */}
                    {role === 'startup' && (
                      <Link 
                        to="/chat" 
                        className="block w-full text-left px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Сообщения
                      </Link>
                    )}
                    <button onClick={() => { 
                      setIsProfileMenuOpen(false); 
                      const startupToken = localStorage.getItem('startupToken');
                      const investorToken = localStorage.getItem('investorToken');
                      const adminToken = localStorage.getItem('adminToken');
                      const userToken = localStorage.getItem('userToken');
                      
                      if (startupToken) {
                        navigate('/startup-dashboard');
                      } else if (investorToken) {
                        navigate('/investor-dashboard');
                      } else if (adminToken) {
                        navigate('/admin-panel');
                      } else if (userToken) {
                        navigate('/profile');
                      } else {
                        navigate('/login');
                      }
                    }} className="block w-full text-left px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">Профиль</button>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">Выйти</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button 
              onClick={handleLoginClick}
              className="px-4 sm:px-5 py-2 rounded-lg font-semibold text-[#FFD700] border-2 border-[#FFD700] bg-transparent hover:bg-[#FFD700] hover:text-[#1a365d] transition text-sm sm:text-base shadow cursor-pointer"
            >
              Войти
            </button>
          )}
        </div>
      </nav>

      {/* Модальное окно входа */}
      {showLoginModal && (
        <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onForgot={handleForgotPassword}
            onRegister={handleRegister}
          />
        </Modal>
      )}
    </>
  );
};

export default Navbar; 