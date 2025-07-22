import React from 'react';

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-sm p-8 bg-gray-50 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Вход в SilkGate</h2>
        {/* Здесь будет форма входа */}
        <form>
          <input className="w-full mb-4 px-4 py-2 border rounded" type="email" placeholder="Email" />
          <input className="w-full mb-6 px-4 py-2 border rounded" type="password" placeholder="Пароль" />
          <button className="w-full py-2 bg-black text-white rounded font-semibold hover:bg-gray-900 transition" type="submit">Войти</button>
        </form>
      </div>
    </div>
  );
} 