import React from 'react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#10182A]">
      <h1 className="text-6xl font-extrabold text-white mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-8">Страница не найдена</p>
      <a href="/" className="text-[#FFD700] border-2 border-[#FFD700] px-6 py-2 rounded-lg font-semibold hover:bg-[#FFD700] hover:text-[#10182A] transition">На главную</a>
    </div>
  );
} 