import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './styles/globals.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import InvestorRegister from './pages/InvestorRegister';
import StartupRegister from './pages/StartupRegister';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import InvestorDashboard from './pages/InvestorDashboardNew';
import Pricing from './pages/PricingNew';
import ProtectedRoute from './components/ProtectedRoute';
import { jwtDecode } from 'jwt-decode';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StartupDashboard from './pages/StartupDashboard';
import StartupUserRegister from './pages/StartupUserRegister';
import VerifyStartupEmail from './pages/VerifyStartupEmail';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/Shared/ToastProvider';
import { AuthProvider } from './components/Shared/AuthContext';
import Footer from './components/Footer';
import Products from './pages/Products';
import Education from './pages/Education';
import Success from './pages/Success';
import Chat from './pages/Chat';
import ChatDemo from './pages/ChatDemo';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import ChatBot from './components/ChatBot/ChatBot';
import WhatsAppChat from './components/Chat/WhatsAppChat';
import { useNavigate } from 'react-router-dom';

import Jobs from './pages/Jobs';
import PostJob from './pages/PostJob';
import HRPartner from './pages/HRPartner';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Docs from './pages/Docs';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contacts from './pages/Contacts';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import InvestorApplication from './pages/InvestorApplication';
import StartupApplication from './pages/StartupApplication';

// Компонент для маршрута чата с навигацией
function ChatRoute() {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate(-1); // Возвращаемся на предыдущую страницу
  };
  
  return <WhatsAppChat onClose={handleClose} />;
}

function AppRoutes() {
  const location = useLocation();
  const authPages = [
    '/login',
    '/investor-register',
    '/startup-register',
    '/admin',
    '/forgot-password',
  ];
  const isResetPassword = location.pathname.startsWith('/reset-password');
  const isStartupVerify = location.pathname.startsWith('/startup-verify-email');
  const hasAuthButtons = authPages.includes(location.pathname) || isResetPassword;

  // Получаем данные пользователя из токена
  let user = null;
  let role = null;
  let name = null;
  const investorToken = localStorage.getItem('investorToken');
  const adminToken = localStorage.getItem('adminToken');
  const startupToken = localStorage.getItem('startupToken');
  const userToken = localStorage.getItem('userToken');
  if (investorToken) {
    try {
      const decoded = jwtDecode(investorToken);
      user = decoded;
      role = 'investor';
      name = decoded.name || decoded.email;
    } catch {}
  } else if (adminToken) {
    try {
      const decoded = jwtDecode(adminToken);
      user = decoded;
      role = 'admin';
      name = 'Admin';
    } catch {}
  } else if (startupToken) {
    try {
      const decoded = jwtDecode(startupToken);
      user = decoded;
      role = 'startup';
      name = decoded.name || decoded.email;
    } catch {}
  } else if (userToken) {
    try {
      const decoded = jwtDecode(userToken);
      user = decoded;
      role = 'user';
      name = decoded.name || decoded.email;
    } catch {}
  }

  function handleLogout() {
    if (role === 'investor') {
      localStorage.removeItem('investorToken');
      window.location.href = '/login';
    } else if (role === 'admin') {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin';
    } else if (role === 'startup') {
      localStorage.removeItem('startupToken');
      window.location.href = '/login';
    } else if (role === 'user') {
      localStorage.removeItem('userToken');
      window.location.href = '/login';
    }
  }

  return (
    <>
      <Navbar user={user} role={role} name={name} hasAuthButtons={hasAuthButtons} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/investor-register" element={<InvestorRegister />} />
        <Route path="/startup-register" element={<StartupUserRegister />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
        <Route path="/investor-dashboard" element={<ProtectedRoute role="investor"><InvestorDashboard /></ProtectedRoute>} />
        <Route path="/startup-dashboard" element={<ProtectedRoute role="startup"><StartupDashboard /></ProtectedRoute>} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/startup-verify-email/:token" element={<VerifyStartupEmail />} />
        <Route path="/projects" element={<Products />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/education" element={<Education />} />
        <Route path="/education/seminars" element={<Education />} />
        <Route path="/education/calendar" element={<Education />} />
        <Route path="/success" element={<Success />} />

        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/post" element={<PostJob />} />
        <Route path="/jobs/hr" element={<HRPartner />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/user-dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute role="user"><UserProfile /></ProtectedRoute>} />
        <Route path="/investor-application" element={<ProtectedRoute role="user"><InvestorApplication /></ProtectedRoute>} />
        <Route path="/startup-application" element={<ProtectedRoute role="user"><StartupApplication /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute role={['investor', 'startup', 'admin']}><ChatRoute /></ProtectedRoute>} />
        <Route path="/chat-demo" element={<ChatDemo />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ChatBot />
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App; 