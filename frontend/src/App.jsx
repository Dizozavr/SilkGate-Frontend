import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import InvestorRegister from './pages/InvestorRegister';
import StartupRegister from './pages/StartupRegister';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Навигация */}
        <nav className="flex justify-between items-center px-8 py-6 border-b">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-gray-900">
            SilkGate
          </Link>
          <div className="flex gap-4">
            <Link to="/login" className="px-5 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition">Войти</Link>
            <Link to="/admin" className="px-5 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition">Админ</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/investor-register" element={<InvestorRegister />} />
          <Route path="/startup-register" element={<StartupRegister />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Футер */}
        <footer className="text-center text-gray-400 py-6 border-t mt-12 text-sm">
          © {new Date().getFullYear()} SilkGate.
        </footer>
      </div>
    </Router>
  );
}

export default App; 