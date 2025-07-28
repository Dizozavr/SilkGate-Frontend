import React from 'react';

export default function Docs() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Документация</h1>
      <p className="text-lg text-gray-300 mb-8 max-w-2xl text-center">В этом разделе будет размещена техническая и пользовательская документация по платформе SilkGate.</p>
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <div className="bg-[#1A2238] rounded-2xl shadow p-6">
          <div className="text-[#FFD700] font-semibold mb-2">Для пользователей</div>
          <div className="text-gray-200">Руководства, инструкции, ответы на вопросы.</div>
        </div>
        <div className="bg-[#1A2238] rounded-2xl shadow p-6">
          <div className="text-[#FFD700] font-semibold mb-2">Для разработчиков</div>
          <div className="text-gray-200">API, интеграции, примеры кода.</div>
        </div>
      </div>
    </div>
  );
} 