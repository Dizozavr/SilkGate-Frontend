import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Shared/Icon';

export default function Jobs() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechStart Inc.",
      location: "Москва",
      type: "Полная занятость",
      salary: "150,000 - 200,000 ₽",
      category: "Разработка",
      description: "Ищем опытного Frontend разработчика для работы над инновационными проектами.",
      requirements: ["React", "TypeScript", "3+ года опыта"],
      image: "/news/koncepcia-noutbuka-s-interfeisom-blue-hud.jpg"
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Innovation Labs",
      location: "Санкт-Петербург",
      type: "Полная занятость",
      salary: "200,000 - 250,000 ₽",
      category: "Менеджмент",
      description: "Управление продуктом в быстрорастущем стартапе в сфере AI.",
      requirements: ["Product Management", "AI/ML", "5+ лет опыта"],
      image: "/news/3d-rendering-sovremennogo-nizkopoligonal-nogo-dizaina-spletenia.jpg"
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "DataCorp",
      location: "Москва",
      type: "Удаленная работа",
      salary: "180,000 - 220,000 ₽",
      category: "Данные",
      description: "Разработка алгоритмов машинного обучения для анализа больших данных.",
      requirements: ["Python", "TensorFlow", "PhD приветствуется"],
      image: "/news/svaz-svaz-podklucit-koncepcia-setevogo-edinenia.jpg"
    },
    {
      id: 4,
      title: "UI/UX Designer",
      company: "Design Studio",
      location: "Москва",
      type: "Контракт",
      salary: "120,000 - 150,000 ₽",
      category: "Дизайн",
      description: "Создание пользовательских интерфейсов для мобильных и веб-приложений.",
      requirements: ["Figma", "Adobe Creative Suite", "2+ года опыта"],
      image: "/news/3d-fon-soedinenia-s-nizkopoligonal-nymi-soedinitel-nymi-liniami-i-tockami.jpg"
    }
  ];

  const categories = [
    { id: 'all', name: 'Все категории' },
    { id: 'development', name: 'Разработка' },
    { id: 'management', name: 'Менеджмент' },
    { id: 'data', name: 'Данные' },
    { id: 'design', name: 'Дизайн' },
    { id: 'marketing', name: 'Маркетинг' }
  ];

  const filteredJobs = selectedCategory === 'all' 
    ? jobs 
    : jobs.filter(job => job.category.toLowerCase().includes(selectedCategory));

  return (
    <div className="min-h-screen bg-[#10182A] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
            Вакансии
          </h1>
          <p className="text-lg text-muted font-light max-w-2xl leading-tight">
            Найдите работу своей мечты в инновационных стартапах и технологических компаниях.
          </p>
        </div>
        
        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-light transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Список вакансий */}
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-6">
                {/* Изображение компании */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden">
                    <img
                      src={job.image}
                      alt={job.company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Контент */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-light text-gray-900 leading-tight mb-1">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-light leading-tight">
                        {job.company} • {job.location}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-light rounded-full">
                      {job.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm font-light leading-tight mb-4">
                    {job.description}
                  </p>
                  
                  {/* Требования */}
                  <div className="flex items-center gap-2 mb-4">
                    {job.requirements.map((req, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-light rounded"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                  
                  {/* Метаданные */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Icon name="time" size={16} />
                        <span className="text-sm font-light text-gray-500">
                          {job.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="award" size={16} />
                        <span className="text-sm font-light text-gray-500">
                          {job.salary}
                        </span>
                      </div>
                    </div>
                    
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-light">
                      Откликнуться
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Разместить вакансию */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center mb-6">
            <Icon name="add" size={32} className="mr-4" />
            <h2 className="text-xl font-light text-gray-900">Разместить вакансию</h2>
          </div>
          <p className="text-gray-600 text-sm font-light leading-tight mb-6">
            Ищете талантливых специалистов? Разместите вакансию на нашей платформе и найдите идеального кандидата.
          </p>
          <Link
            to="/jobs/post"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-light"
          >
            Разместить вакансию
          </Link>
        </div>
        
        {/* Демо-информация */}
        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-light text-white mb-4">Демо-версия</h3>
          <p className="text-muted text-sm font-light leading-tight">
            Это демо-страница вакансий. В полной версии здесь будет система поиска работы, 
            фильтрация по различным параметрам и интеграция с HR-системами.
          </p>
        </div>
      </div>
    </div>
  );
} 