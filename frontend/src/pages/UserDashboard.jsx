import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#10182A] flex flex-col items-center justify-center px-2 sm:px-0">
      <div className="w-full max-w-md p-8 bg-[#F5F6FA] rounded-lg shadow text-center">
        <h2 className="text-2xl font-bold mb-6 text-[#10182A]">Добро пожаловать!</h2>
        <p className="mb-6 text-[#232B45]">Вы авторизованы как пользователь. Заполните профиль или выберите роль:</p>
        <div className="flex flex-col gap-4">
          <button className="w-full py-2 bg-[#FFD700] text-[#10182A] rounded font-semibold hover:bg-yellow-400 transition" onClick={() => navigate('/investor-register')}>Стать инвестором</button>
          <button className="w-full py-2 bg-[#FFD700] text-[#10182A] rounded font-semibold hover:bg-yellow-400 transition" onClick={() => navigate('/startup-register')}>Стать стартапером</button>
        </div>
      </div>
    </div>
  );
} 