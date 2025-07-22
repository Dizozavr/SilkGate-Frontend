import React from 'react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Страница не найдена</p>
      <a href="/" className="text-blue-600 hover:underline">На главную</a>
    </div>
  );
} 