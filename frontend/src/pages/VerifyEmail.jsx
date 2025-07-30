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
    <div className="min-h-screen bg-[#10182A] flex flex-col">
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#10182A] px-2 sm:px-0">
        <div
          className="w-full flex flex-col items-center bg-white relative auth-form"
          style={{
            maxWidth: 420,
            minWidth: 320,
            borderRadius: 16,
            padding: '48px 40px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            boxShadow: 'none',
          }}
        >
          <div className="w-full flex flex-col items-start mt-2 mb-8" style={{ marginLeft: 0 }}>
            <h2
              className="mb-2"
              style={{
                fontSize: '2rem',
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: 0,
                color: '#222',
                marginBottom: 8,
              }}
            >
              Подтверждение email
            </h2>
          </div>
          {status === 'loading' && (
            <div style={{ color: '#6b7280', fontSize: '1rem', textAlign: 'center' }}>
              Проверка...
            </div>
          )}
          {status === 'success' && (
            <>
              <div style={{ color: '#10b981', fontSize: '1rem', textAlign: 'center', marginBottom: 24 }}>
                {message}
              </div>
              <Link 
                to="/login"
                style={{
                  width: '100%',
                  borderRadius: 8,
                  padding: '12px 16px',
                  fontWeight: 500,
                  fontSize: '1rem',
                  minHeight: 48,
                  background: '#FFD700',
                  color: '#10182A',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => e.target.style.background = '#E6C200'}
                onMouseLeave={(e) => e.target.style.background = '#FFD700'}
              >
                Войти
              </Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div style={{ color: '#ef4444', fontSize: '1rem', textAlign: 'center', marginBottom: 24 }}>
                {message}
              </div>
              <Link 
                to="/"
                style={{
                  width: '100%',
                  borderRadius: 8,
                  padding: '12px 16px',
                  fontWeight: 500,
                  fontSize: '1rem',
                  minHeight: 48,
                  background: '#FFD700',
                  color: '#10182A',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => e.target.style.background = '#E6C200'}
                onMouseLeave={(e) => e.target.style.background = '#FFD700'}
              >
                На главную
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 