import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './Shared/AuthContext';
import Modal from './Shared/Modal';
import LoginForm from './Auth/LoginForm';
import NotificationCenter from './Shared/NotificationCenter';
import Icon from './Shared/Icon';

const Navbar = () => {
  const { user, role, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const [showJobsDropdown, setShowJobsDropdown] = useState(false);
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState('RU');
  const profileMenuRef = useRef(null);
  
  const [productsTimeout, setProductsTimeout] = useState(null);
  const [educationTimeout, setEducationTimeout] = useState(null);
  const [jobsTimeout, setJobsTimeout] = useState(null);
  const [resourcesTimeout, setResourcesTimeout] = useState(null);

  const hasAnyToken = localStorage.getItem('startupToken') || 
                     localStorage.getItem('investorToken') || 
                     localStorage.getItem('adminToken') || 
                     localStorage.getItem('userToken');

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

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'RU' ? 'EN' : 'RU');
  };

  console.log('Navbar render - hasAnyToken:', hasAnyToken, 'showLoginModal:', showLoginModal);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#10182A] text-white border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20 py-2">
            {/* Логотип */}
            <Link to="/" className="flex items-center space-x-3 py-2 focus:outline-none">
              <img src="/logo-icon-new.png" alt="SilkGate" className="w-8 h-8" />
              <span className="text-[#FFD700] font-bold text-xl">SilkGate</span>
            </Link>

            {/* Навигационные ссылки с выпадающими меню - подвинуты ближе к иконке сообщений */}
            <div className="hidden md:flex items-center space-x-6 ml-auto mr-8">
              {/* Проекты с выпадающим меню */}
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
                  className="hover:text-[#FFD700] transition flex items-center text-xs font-light py-2 px-1 focus:outline-none"
                >
                  Проекты
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
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
                    className="absolute top-full left-0 mt-2 w-48 bg-[#1a2238] border border-gray-600 rounded-lg shadow-lg py-1 z-50"
                  >
                    <Link to="/projects" className="block px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none">Каталог</Link>
                    <Link to="/news" className="block px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none">Новости</Link>
                    <Link to="/pricing" className="block px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none">Тарифы</Link>
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
                  className="hover:text-[#FFD700] transition flex items-center text-xs font-light py-2 px-1 focus:outline-none"
                >
                  Образование
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
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
                    className="absolute top-full left-0 mt-2 w-48 bg-[#1a2238] border border-gray-600 rounded-lg shadow-lg py-1 z-50"
                  >
                    <Link to="/education" className="block px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none">Семинары</Link>
                    <Link to="/education/calendar" className="block px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none">Календарь</Link>
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
                  className="hover:text-[#FFD700] transition flex items-center text-xs font-light py-2 px-1 focus:outline-none"
                >
                  Работа
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
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
                    className="absolute top-full left-0 mt-2 w-48 bg-[#1a2238] border border-gray-600 rounded-lg shadow-lg py-1 z-50"
                  >
                    <Link to="/jobs" className="block px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none">Вакансии</Link>
                    <Link to="/jobs/post" className="block px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none">Разместить вакансию</Link>
                    <Link to="/jobs/hr" className="block px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none">HR-партнер</Link>
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
                  className="hover:text-[#FFD700] transition flex items-center text-xs font-light py-2 px-1 focus:outline-none"
                >
                  Ресурсы
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
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
                    className="absolute top-full left-0 mt-2 w-48 bg-[#1a2238] border border-gray-600 rounded-lg shadow-lg py-1 z-50"
                  >
                    <Link to="/docs" className="block px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none">Документация</Link>
                    <Link to="/faq" className="block px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none">FAQ</Link>
                    <Link to="/about" className="block px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none">О нас</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Правая часть */}
            <div className="flex items-center space-x-4">
              {/* Центр уведомлений с сообщениями */}
              {hasAnyToken && (
                <NotificationCenter />
              )}

              {/* Разделитель */}
              <div className="w-px h-6 bg-gray-600"></div>

              {/* Кнопка входа/профиль */}
              {hasAnyToken ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 text-xs font-light hover:text-[#FFD700] transition-colors py-2 px-1 focus:outline-none"
                  >
                    <span>{user?.name || 'Пользователь'}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1a2238] border border-gray-600 rounded-lg shadow-lg z-50">
                      <div className="py-1">
                        {role === 'investor' && (
                          <Link
                            to="/investor-dashboard"
                            className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Дашборд инвестора
                          </Link>
                        )}
                        {role === 'startup' && (
                          <Link
                            to="/startup-dashboard"
                            className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Дашборд стартапа
                          </Link>
                        )}
                        {role === 'admin' && (
                          <Link
                            to="/admin-panel"
                            className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Панель администратора
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-gray-700 focus:outline-none"
                        >
                          Выйти
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="border border-[#FFD700] text-white px-4 py-2 text-xs font-light hover:bg-[#FFD700] hover:text-[#10182A] transition-colors focus:outline-none"
                >
                  ВХОД
                </button>
              )}

              {/* Переключатель языков - сдвинут правее после кнопки входа */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={toggleLanguage}
                  className={`w-5 h-5 rounded-full text-xs font-light transition-colors focus:outline-none ${
                    currentLanguage === 'RU' 
                      ? 'bg-white text-[#10182A]' 
                      : 'bg-transparent text-white border border-gray-600'
                  }`}
                >
                  RU
                </button>
                <button
                  onClick={toggleLanguage}
                  className={`w-5 h-5 rounded-full text-xs font-light transition-colors focus:outline-none ${
                    currentLanguage === 'EN' 
                      ? 'bg-white text-[#10182A]' 
                      : 'bg-transparent text-white border border-gray-600'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Модальное окно входа */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onForgotPassword={handleForgotPassword}
          onRegister={handleRegister}
        />
      </Modal>
    </>
  );
};

export default Navbar; 