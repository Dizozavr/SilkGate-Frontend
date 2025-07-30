import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`http://localhost:5000/api/investors/verify/${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email успешно подтверждён!');
        } else {
          setStatus('error');
          setMessage(data.message || 'Ошибка подтверждения email.');
        }
      } catch {
        setStatus('error');
        setMessage('Ошибка подтверждения email.');
      }
    }
    if (token) verify();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#10182A]">
      <div className="w-full max-w-md p-8 bg-[#F5F6FA] rounded-lg shadow text-center">
        {status === 'loading' && <div className="text-[#10182A]">Проверка...</div>}
        {status === 'success' && <>
          <div className="text-green-600 text-xl mb-4">{message}</div>
          <Link to="/login" className="text-[#FFD700] hover:underline font-semibold">Войти</Link>
        </>}
        {status === 'error' && <>
          <div className="text-red-600 text-xl mb-4">{message}</div>
          <Link to="/" className="text-[#FFD700] hover:underline font-semibold">На главную</Link>
        </>}
      </div>
    </div>
  );
} 