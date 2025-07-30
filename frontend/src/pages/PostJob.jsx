import React, { useState, useEffect } from 'react';
import { useToast } from '../components/Shared/ToastProvider';

export default function PostJob() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    contact: '',
    description: ''
  });
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Получаем данные профиля пользователя
    const profileData = localStorage.getItem('userProfileData');
    if (profileData) {
      try {
        const profile = JSON.parse(profileData);
        setUserProfile(profile);
        // Автозаполняем форму данными из профиля
        setFormData(prev => ({
          ...prev,
          company: profile.name || '',
          contact: profile.phone || ''
        }));
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('investorToken') || localStorage.getItem('startupToken');
      
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.showToast('Заявка на размещение вакансии отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
        setFormData({
          title: '',
          company: '',
          contact: '',
          description: ''
        });
      } else {
        const errorData = await response.json();
        toast.showToast(errorData.message || 'Ошибка при отправке заявки', 'error');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      toast.showToast('Ошибка при отправке заявки', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-['Playfair_Display']">Разместить вакансию</h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl font-['Inter']">Заполните форму — мы свяжемся с вами для публикации вакансии на платформе SilkGate.</p>
        
        {userProfile && (
          <div className="mb-6 p-6 bg-white rounded-2xl shadow-lg text-gray-700 font-['Inter']">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-semibold">Ваши данные из профиля автоматически заполнены</p>
            </div>
            <p className="text-sm">Имя: <span className="font-medium">{userProfile.name || 'Не указано'}</span></p>
            <p className="text-sm">Телефон: <span className="font-medium">{userProfile.phone || 'Не указан'}</span></p>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">Название вакансии</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder-gray-500 font-['Inter']" 
                placeholder="Например: Frontend-разработчик" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">Компания</label>
              <input 
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder-gray-500 font-['Inter']" 
                placeholder="Название вашей компании" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">Контактная информация</label>
              <input 
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder-gray-500 font-['Inter']" 
                placeholder="Email или телефон для связи" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">Описание вакансии</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 placeholder-gray-500 min-h-[100px] font-['Inter']" 
                placeholder="Опишите требования, обязанности, условия работы..."
                required
              ></textarea>
            </div>
            <button type="submit" className="mt-4 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition font-['Inter']">Отправить заявку</button>
          </form>
        </div>
      </div>
    </div>
  );
} 