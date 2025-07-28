import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './Shared/AuthContext';
import RegisterForm from './Auth/RegisterForm';
import Modal from './Shared/Modal';
import ForgotPasswordForm from './Auth/ForgotPasswordForm';
import LoginForm from './Auth/LoginForm';

const menu = [
  {
    title: 'Продукты',
    items: [
      { label: 'Витрина проектов', to: '/projects' },
      { label: 'Истории успеха', to: '/success' },
      { label: 'Партнёры', to: '/partners' },
    ],
  },
  {
    title: 'Образование',
    items: [
      { label: 'Семинары и тренинги', to: '/education/seminars' },
      { label: 'Календарь событий', to: '/education/calendar' },
    ],
  },
  {
    title: 'Работа',
    items: [
      { label: 'Открытые вакансии', to: '/jobs' },
      { label: 'Разместить вакансию', to: '/jobs/post' },
      { label: 'HR-партнёрство', to: '/jobs/hr' },
    ],
  },
  {
    title: 'Ресурсы',
    items: [
      { label: 'FAQ', to: '/faq' },
      { label: 'О нас', to: '/about' },
      { label: 'Документация', to: '/docs' },
      { label: 'Блог / Новости', to: '/news' },
    ],
  },
];

export default function Navbar({ hasAuthButtons = false }) {
  const { user, role, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Принудительно обновляем состояние при изменении токенов
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const handleStorageChange = () => {
      forceUpdate({});
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const isAdminPanel = location.pathname === '/admin-panel';
  const isAdminLogin = location.pathname === '/admin';
  const isForgot = location.pathname === '/forgot-password';
  const isInvestor = role === 'investor';
  const isStartup = role === 'startup';
  const isAdmin = role === 'admin';
  const isMain = location.pathname === '/';
  const isLogin = location.pathname === '/login';
  const isInvestorRegister = location.pathname === '/investor-register';
  const isStartupRegister = location.pathname === '/startup-register';
  const isResetPassword = location.pathname.startsWith('/reset-password');
  const hideLogin = isAdminPanel || isAdminLogin || isForgot;

  const [open, setOpen] = useState(null);
  const closeTimeout = useRef();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogin, setShowLogin] = useState(true); // true = login, false = register
  const [showForgot, setShowForgot] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  function handleMenuEnter(idx) {
    clearTimeout(closeTimeout.current);
    setOpen(idx);
  }
  function handleMenuLeave() {
    closeTimeout.current = setTimeout(() => setOpen(null), 200);
  }
  function handleMenuBlockEnter() {
    clearTimeout(closeTimeout.current);
  }
  function handleMenuBlockLeave() {
    closeTimeout.current = setTimeout(() => setOpen(null), 200);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-4 sm:py-6 bg-[#10182A] border-b-0 shadow-md relative z-30">
      <Link to="/" className="flex items-center gap-2 mb-2 sm:mb-0">
        <img src="/logo.png" alt="SilkGate logo" className="h-12 sm:h-16 w-auto" style={{ filter: 'none' }} />
      </Link>
      <div className="flex gap-2 sm:gap-6 items-center">
        {/* Мегаменю */}
        {menu.map((section, idx) => (
          <div
            key={section.title}
            className="relative"
            onMouseEnter={() => handleMenuEnter(idx)}
            onMouseLeave={handleMenuLeave}
          >
            <button className="px-3 py-2 rounded-lg font-semibold text-white hover:text-[#FFD700] transition text-base focus:outline-none">
              {section.title}
            </button>
            {open === idx && (
              <div
                className={`absolute ${idx === menu.length - 1 ? (hasAuthButtons ? 'right-0' : 'right-[-24px]') : idx === menu.length - 2 ? (hasAuthButtons ? 'left-0' : 'left-[-24px]') : 'left-0'} top-full min-w-[220px] bg-[#1A2238] rounded-xl shadow-xl py-3 mt-2 flex flex-col gap-1 border border-[#232B45] animate-fade-in z-40`}
                onMouseEnter={handleMenuBlockEnter}
                onMouseLeave={handleMenuBlockLeave}
              >
                {section.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="px-5 py-2 text-left text-white hover:text-[#FFD700] hover:bg-[#232B45] rounded transition text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {/* Кнопка Войти/Выйти */}
        {(user && token) || localStorage.getItem('startupToken') || localStorage.getItem('investorToken') || localStorage.getItem('adminToken') || localStorage.getItem('userToken') ? (
          <div className="relative" ref={profileMenuRef}>
            <button
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg font-semibold text-[#FFD700] border-2 border-[#FFD700] bg-transparent hover:bg-[#FFD700] hover:text-[#10272F] transition text-sm sm:text-base shadow"
              onClick={() => setIsProfileMenuOpen(v => !v)}
            >
              <span>{user?.name || user?.email || 'Профиль'}</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-2 z-50">
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
                    navigate('/user-dashboard');
                  } else {
                    navigate('/login');
                  }
                }} className="block w-full text-left px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">Профиль</button>
                <button onClick={() => { setIsProfileMenuOpen(false); handleLogout(); }} className="block w-full text-left px-4 py-2 text-[#10182A] hover:bg-[#F5F6FA]">Выйти</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="px-4 sm:px-5 py-2 rounded-lg font-semibold text-[#FFD700] border-2 border-[#FFD700] bg-transparent hover:bg-[#FFD700] hover:text-[#10272F] transition text-sm sm:text-base shadow mr-2" onClick={() => { setShowLoginModal(true); setShowLogin(true); setShowForgot(false); }}>Войти</button>
            <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
              {showForgot ? (
                <ForgotPasswordForm onBack={() => { setShowForgot(false); setShowLogin(true); }} />
              ) : showLogin ? (
                <LoginForm
                  onForgot={() => { setShowForgot(true); setShowLogin(false); }}
                  onRegister={() => { setShowLogin(false); setShowForgot(false); }}
                  onSuccess={role => {
                    setShowLoginModal(false);
                    // Можно добавить редирект по роли, если нужно
                  }}
                />
              ) : (
                <RegisterForm onSuccess={() => setShowLoginModal(false)} onSwitchToLogin={() => { setShowLogin(true); setShowForgot(false); }} />
              )}
            </Modal>
          </>
        )}
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.18s ease; }
      `}</style>
    </nav>
  );
} 