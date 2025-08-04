import React from 'react';
import Icon from '../components/Shared/Icon';

export default function About() {
  return (
    <div className="min-h-screen bg-[#10182A] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
            О нас
          </h1>
          <p className="text-lg text-muted font-light max-w-2xl leading-tight">
            SilkGate — это команда экспертов в области стартапов, инвестиций и технологий. Наша миссия — соединять лучшие проекты с лучшими инвесторами и создавать экосистему для роста.
          </p>
        </div>
        
        {/* Основные блоки */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-4">
              <Icon name="compass" size={32} className="mr-3" />
              <h2 className="text-xl font-light text-gray-900">Миссия</h2>
            </div>
            <p className="text-gray-600 text-sm font-light leading-tight">
              Создавать прозрачную, эффективную и безопасную среду для развития инноваций и инвестиций.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-4">
              <Icon name="user" size={32} className="mr-3" />
              <h2 className="text-xl font-light text-gray-900">Команда</h2>
            </div>
            <p className="text-gray-600 text-sm font-light leading-tight">
              Наша команда — это специалисты с опытом в венчурных фондах, IT, юридической поддержке и маркетинге.
            </p>
          </div>
        </div>
        
        {/* Ценности */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-light text-gray-900 mb-8">Наши ценности</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="award" size={32} />
              </div>
              <h3 className="text-lg font-light text-gray-900 mb-2">Инновации</h3>
              <p className="text-gray-600 text-sm font-light leading-tight">
                Постоянное развитие и внедрение новых технологий
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="heart" size={32} />
              </div>
              <h3 className="text-lg font-light text-gray-900 mb-2">Партнерство</h3>
              <p className="text-gray-600 text-sm font-light leading-tight">
                Долгосрочные отношения с клиентами и партнерами
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="security" size={32} />
              </div>
              <h3 className="text-lg font-light text-gray-900 mb-2">Безопасность</h3>
              <p className="text-gray-600 text-sm font-light leading-tight">
                Защита данных и конфиденциальность
              </p>
            </div>
          </div>
        </div>
        
        {/* Демо-информация */}
        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-light text-white mb-4">Демо-версия</h3>
          <p className="text-muted text-sm font-light leading-tight">
            Это демо-страница "О нас". В полной версии здесь будет расширенная информация о команде, 
            истории компании, достижениях и других аспектах деятельности SilkGate.
          </p>
        </div>
      </div>
    </div>
  );
} 