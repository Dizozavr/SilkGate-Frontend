const fs = require('fs');
const { createCanvas } = require('canvas');

// Создаем canvas для генерации изображений
const width = 300;
const height = 200;

// Цветовые градиенты для изображений
const gradients = [
  ['#667eea', '#764ba2'], // Фиолетово-синий
  ['#f093fb', '#f5576c'], // Розово-красный
  ['#4facfe', '#00f2fe'], // Голубой
  ['#43e97b', '#38f9d7'], // Зеленый
  ['#fa709a', '#fee140'], // Розово-желтый
  ['#a8edea', '#fed6e3'], // Мятно-розовый
  ['#ff9a9e', '#fecfef'], // Светло-розовый
  ['#ffecd2', '#fcb69f'], // Оранжевый
  ['#a18cd1', '#fbc2eb'], // Лавандовый
  ['#ffecd2', '#fcb69f']  // Персиковый
];

// Темы для изображений
const techThemes = [
  'AI & Neural Networks', 'Startup Innovation', 'Digital Transformation',
  'Cloud Computing', 'Mobile Technology', 'Blockchain & Crypto',
  'Virtual Reality', 'IoT & Smart Devices', 'Cybersecurity', 'Fintech',
  'Healthcare Tech', 'E-commerce', 'Social Media', 'Gaming', 'Education Tech',
  'Transportation', 'Energy & Green Tech', 'Space Technology', 'Biotech', 'Robotics',
  'Data Analytics', 'Machine Learning', 'Quantum Computing', 'Augmented Reality', '5G Networks',
  'Smart Cities', 'Digital Marketing', 'Video Streaming', 'Music Tech', 'Fitness Tech',
  'Real Estate Tech', 'Travel Tech', 'Food Tech', 'Fashion Tech', 'Entertainment',
  'Workplace Tech', 'Communication', 'Productivity Tools', 'Creative Tech', 'Social Impact',
  'Financial Services', 'Insurance Tech', 'Legal Tech', 'Government Tech', 'Non-profit Tech',
  'Environmental Tech', 'Agricultural Tech', 'Manufacturing Tech', 'Retail Tech', 'Logistics Tech'
];

function createGradientImage(index) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Выбираем градиент
  const gradientColors = gradients[index % gradients.length];
  
  // Создаем градиент
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, gradientColors[0]);
  gradient.addColorStop(1, gradientColors[1]);
  
  // Заполняем фон
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Добавляем текст
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`Tech ${index + 1}`, width / 2, height / 2 - 10);
  
  ctx.font = '14px Arial';
  ctx.fillText(techThemes[index], width / 2, height / 2 + 20);
  
  // Добавляем иконку или символ
  ctx.font = '48px Arial';
  ctx.fillText('⚡', width / 2, height / 2 - 50);
  
  return canvas.toBuffer('image/jpeg', { quality: 0.9 });
}

// Генерируем все изображения
console.log('Generating 50 tech news images...');

for (let i = 1; i <= 50; i++) {
  try {
    const imageBuffer = createGradientImage(i - 1);
    const filename = `tech${i}.jpg`;
    fs.writeFileSync(filename, imageBuffer);
    console.log(`✅ Generated ${filename}`);
  } catch (error) {
    console.error(`❌ Error generating tech${i}.jpg:`, error.message);
  }
}

console.log('🎉 All images generated successfully!'); 