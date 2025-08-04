import React from 'react';
import Icon from '../components/Shared/Icon';

export default function Docs() {
  return (
    <div className="min-h-screen bg-[#10182A] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
            Документация
          </h1>
          <p className="text-lg text-muted font-light max-w-2xl mx-auto leading-tight">
            В этом разделе будет размещена техническая и пользовательская документация по платформе SilkGate.
          </p>
        </div>
        
        {/* Основные разделы */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <Icon name="user" size={32} className="mr-4" />
              <h2 className="text-xl font-light text-gray-900">Для пользователей</h2>
            </div>
            <p className="text-gray-600 text-sm font-light leading-tight mb-6">
              Руководства, инструкции, ответы на вопросы.
            </p>
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-light">
              Открыть руководство
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <Icon name="database" size={32} className="mr-4" />
              <h2 className="text-xl font-light text-gray-900">Для разработчиков</h2>
            </div>
            <p className="text-gray-600 text-sm font-light leading-tight mb-6">
              API, интеграции, примеры кода.
            </p>
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-light">
              Открыть API
            </button>
          </div>
        </div>
        
        {/* Дополнительные разделы */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Icon name="file" size={24} className="mr-3" />
              <h3 className="text-lg font-light text-gray-900">Быстрый старт</h3>
            </div>
            <p className="text-gray-600 text-sm font-light leading-tight mb-4">
              Пошаговые инструкции для начала работы с платформой.
            </p>
            <button className="text-blue-600 text-sm font-light hover:underline">
              Читать →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Icon name="search" size={24} className="mr-3" />
              <h3 className="text-lg font-light text-gray-900">FAQ</h3>
            </div>
            <p className="text-gray-600 text-sm font-light leading-tight mb-4">
              Часто задаваемые вопросы и ответы на них.
            </p>
            <button className="text-blue-600 text-sm font-light hover:underline">
              Перейти →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Icon name="chat" size={24} className="mr-3" />
              <h3 className="text-lg font-light text-gray-900">Поддержка</h3>
            </div>
            <p className="text-gray-600 text-sm font-light leading-tight mb-4">
              Свяжитесь с нашей командой поддержки.
            </p>
            <button className="text-blue-600 text-sm font-light hover:underline">
              Связаться →
            </button>
          </div>
        </div>
        
        {/* Последние обновления */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <div className="flex items-center mb-6">
            <Icon name="time" size={32} className="mr-4" />
            <h2 className="text-xl font-light text-gray-900">Последние обновления</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="text-sm font-light text-gray-900 mb-1">
                  Обновление API v2.1
                </h4>
                <p className="text-gray-600 text-xs font-light leading-tight">
                  Добавлены новые эндпоинты для работы с аналитикой и улучшена производительность.
                </p>
                <span className="text-gray-500 text-xs font-light">2 дня назад</span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="text-sm font-light text-gray-900 mb-1">
                  Новые функции поиска
                </h4>
                <p className="text-gray-600 text-xs font-light leading-tight">
                  Расширены возможности фильтрации и поиска стартапов и инвесторов.
                </p>
                <span className="text-gray-500 text-xs font-light">1 неделя назад</span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h4 className="text-sm font-light text-gray-900 mb-1">
                  Обновление интерфейса
                </h4>
                <p className="text-gray-600 text-xs font-light leading-tight">
                  Улучшен пользовательский интерфейс и добавлены новые элементы управления.
                </p>
                <span className="text-gray-500 text-xs font-light">2 недели назад</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Демо-информация */}
        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-light text-white mb-4">Демо-версия</h3>
          <p className="text-muted text-sm font-light leading-tight">
            Это демо-страница документации. В полной версии здесь будет подробная техническая документация, 
            руководства пользователя, API документация и система поиска по документации.
          </p>
        </div>
      </div>
    </div>
  );
} 