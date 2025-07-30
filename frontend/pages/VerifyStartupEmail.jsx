import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function VerifyStartupEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`http://localhost:5000/api/startup-users/verify/${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage('Email успешно подтверждён! Теперь вы можете войти.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Ошибка подтверждения.');
        }
      } catch {
        setStatus('error');
        setMessage('Ошибка подтверждения.');
      }
    }
    verify();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#10182A]">
      <div className="w-full max-w-md p-8 bg-[#F5F6FA] rounded-lg shadow text-center">
        <h2 className="text-2xl font-bold mb-6 text-[#10182A]">Подтверждение email</h2>
        {status === 'loading' && <div className="text-[#10182A]">Проверка...</div>}
        {status !== 'loading' && <div className={status === 'success' ? 'text-green-600' : 'text-red-600'}>{message}</div>}
        {status === 'success' && (
          <Link to="/startup-login" className="mt-6 inline-block px-6 py-2 bg-[#FFD700] text-[#10182A] rounded font-semibold hover:bg-yellow-400 transition">Войти</Link>
        )}
      </div>
    </div>
  );
} 