import React from 'react';

export default function HRPartner() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">HR-партнёрство</h1>
      <p className="text-lg text-gray-300 mb-8 max-w-2xl text-center">Хотите стать HR-партнёром SilkGate? Оставьте заявку — мы расскажем о возможностях сотрудничества.</p>
      <form className="bg-[#1A2238] rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
        <input className="rounded px-4 py-2 bg-[#232B45] text-white placeholder-gray-400" placeholder="Компания" />
        <input className="rounded px-4 py-2 bg-[#232B45] text-white placeholder-gray-400" placeholder="Контактный email или телефон" />
        <textarea className="rounded px-4 py-2 bg-[#232B45] text-white placeholder-gray-400 min-h-[80px]" placeholder="Комментарий"></textarea>
        <button type="submit" className="mt-2 px-4 py-2 rounded-lg bg-[#FFD700] text-[#10182A] font-semibold hover:bg-yellow-400 transition">Отправить заявку</button>
      </form>
    </div>
  );
} 