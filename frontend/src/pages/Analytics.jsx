import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('portfolio');

  // Демо-данные для графиков
  const portfolioData = {
    month: [120000, 125000, 132000, 138000, 145000, 152000, 158000, 165000, 172000, 180000, 188000, 195000],
    quarter: [120000, 145000, 172000, 195000],
    year: [120000, 195000]
  };

  const dealsData = {
    month: [2, 3, 1, 4, 2, 5, 3, 4, 6, 3, 5, 4],
    quarter: [6, 9, 13, 12],
    year: [12, 25]
  };

  const returnsData = {
    month: [0, 4.2, 5.6, 4.5, 5.1, 4.8, 3.9, 4.4, 4.2, 4.7, 4.3, 3.7],
    quarter: [0, 15.3, 12.8, 11.2],
    year: [0, 62.5]
  };

  // Генерация точек для графика
  const generateChartPoints = (data, period) => {
    const points = data[period] || data.month;
    const labels = {
      month: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
      quarter: ['Q1', 'Q2', 'Q3', 'Q4'],
      year: ['2023', '2024']
    };
    
    return points.map((value, index) => ({
      label: labels[period][index],
      value: value
    }));
  };

  const chartPoints = generateChartPoints(
    selectedMetric === 'portfolio' ? portfolioData : 
    selectedMetric === 'deals' ? dealsData : returnsData,
    selectedPeriod
  );

  // Расчет статистики
  const calculateStats = () => {
    const data = chartPoints.map(p => p.value);
    const current = data[data.length - 1];
    const previous = data[data.length - 2] || data[0];
    const change = ((current - previous) / previous * 100).toFixed(1);
    
    return {
      current: current.toLocaleString(),
      change: change,
      isPositive: parseFloat(change) >= 0
    };
  };

  const stats = calculateStats();

  // Демо-метрики
  const metrics = [
    {
      title: 'Общий портфель',
      value: '$195,000',
      change: '+3.7%',
      isPositive: true,
      icon: '💰',
      color: 'blue'
    },
    {
      title: 'Активные сделки',
      value: '4',
      change: '+1',
      isPositive: true,
      icon: '📈',
      color: 'green'
    },
    {
      title: 'Средняя доходность',
      value: '3.7%',
      change: '-0.6%',
      isPositive: false,
      icon: '📊',
      color: 'yellow'
    },
    {
      title: 'Новые стартапы',
      value: '12',
      change: '+3',
      isPositive: true,
      icon: '🚀',
      color: 'purple'
    }
  ];

  // Демо-топ проекты
  const topProjects = [
    {
      name: 'ЭкоТех',
      category: 'Экология',
      investment: '$25,000',
      return: '+18.5%',
      status: 'active',
      icon: '🌱'
    },
    {
      name: 'AI Assistant',
      category: 'Искусственный интеллект',
      investment: '$30,000',
      return: '+12.3%',
      status: 'active',
      icon: '🤖'
    },
    {
      name: 'FinTech Pro',
      category: 'Финансовые технологии',
      investment: '$20,000',
      return: '+8.7%',
      status: 'pending',
      icon: '💰'
    },
    {
      name: 'HealthTech',
      category: 'Здравоохранение',
      investment: '$15,000',
      return: '+5.2%',
      status: 'active',
      icon: '🏥'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo-icon-new.png" alt="SilkGate" className="w-8 h-8" />
                <span className="text-[#FFD700] font-bold text-xl">SilkGate</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
                Демо режим
              </span>
              <Link
                to="/investor-dashboard"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                ← Назад к дашборду
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Основные метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-${metric.color}-100`}>
                  {metric.icon}
                </div>
                <span className={`text-sm font-medium ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Основной график */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Динамика портфеля</h2>
            <div className="flex items-center space-x-4">
              {/* Выбор метрики */}
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="portfolio">Портфель ($)</option>
                <option value="deals">Количество сделок</option>
                <option value="returns">Доходность (%)</option>
              </select>
              
              {/* Выбор периода */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="month">Месяц</option>
                <option value="quarter">Квартал</option>
                <option value="year">Год</option>
              </select>
            </div>
          </div>

          {/* График */}
          <div className="h-80 bg-gradient-to-b from-blue-50 to-white rounded-lg p-6">
            <div className="flex items-end justify-between h-full space-x-2">
              {chartPoints.map((point, index) => {
                const maxValue = Math.max(...chartPoints.map(p => p.value));
                const height = (point.value / maxValue) * 100;
                const isCurrent = index === chartPoints.length - 1;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2">{point.label}</div>
                    <div className="relative w-full">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isCurrent 
                            ? 'bg-gradient-to-t from-blue-600 to-blue-400' 
                            : 'bg-gradient-to-t from-blue-400 to-blue-200'
                        }`}
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {selectedMetric === 'portfolio' ? `$${point.value.toLocaleString()}` : 
                           selectedMetric === 'deals' ? `${point.value} сделок` : 
                           `${point.value}%`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Статистика графика */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Текущее значение</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedMetric === 'portfolio' ? `$${stats.current}` : 
                 selectedMetric === 'deals' ? `${stats.current} сделок` : 
                 `${stats.current}%`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Изменение</p>
              <p className={`text-lg font-semibold ${
                stats.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.isPositive ? '+' : ''}{stats.change}%
              </p>
            </div>
          </div>
        </div>

        {/* Топ проекты */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Топ проекты</h3>
            <div className="space-y-4">
              {topProjects.map((project, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">
                    {project.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{project.investment}</p>
                    <p className={`text-sm font-medium ${
                      project.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {project.return}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Демо-отчеты */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Демо-отчеты</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Ежемесячный отчет</h4>
                  <span className="text-xs text-gray-500">PDF</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Детальный анализ портфеля за декабрь 2024</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>📊 15 страниц</span>
                  <span>📅 31.12.2024</span>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Анализ рисков</h4>
                  <span className="text-xs text-gray-500">PDF</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Оценка рисков инвестиционного портфеля</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>📊 8 страниц</span>
                  <span>📅 28.12.2024</span>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Прогноз на 2025</h4>
                  <span className="text-xs text-gray-500">PDF</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Прогноз развития портфеля и новые возможности</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>📊 12 страниц</span>
                  <span>📅 25.12.2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Информация о демо-режиме */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-1">Демо-режим аналитики</h4>
              <p className="text-sm text-yellow-700">
                Это демо-версия системы аналитики. В реальном режиме данные будут обновляться в реальном времени 
                на основе реальных транзакций и инвестиций на платформе.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 