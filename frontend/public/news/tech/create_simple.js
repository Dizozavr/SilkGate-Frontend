// Простой скрипт для создания базовых изображений
const fs = require('fs');
const path = require('path');

// Создаем простые изображения-заглушки
const colors = [
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

const themes = [
  'AI & Neural Networks', 'Startup Innovation', 'Digital Transformation',
  'Cloud Computing', 'Mobile Technology', 'Blockchain & Crypto',
  'Virtual Reality', 'IoT & Smart Devices', 'Cybersecurity', 'Fintech'
];

// Создаем простой HTML файл для генерации изображений
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Quick Image Generator</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .image { 
            width: 300px; 
            height: 200px; 
            border-radius: 8px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-size: 18px; 
            font-weight: bold;
            text-align: center;
            cursor: pointer;
            position: relative;
        }
        .gradient1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .gradient2 { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .gradient3 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .gradient4 { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
        .gradient5 { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .gradient6 { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
        .gradient7 { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
        .gradient8 { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }
        .gradient9 { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }
        .gradient10 { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }
    </style>
</head>
<body>
    <h1>Quick Tech Images Generator</h1>
    <p>Click on any image to download it as tech1.jpg, tech2.jpg, etc.</p>
    
    <div class="container" id="container">
        <!-- Images will be generated here -->
    </div>

    <script>
        const gradients = ['gradient1', 'gradient2', 'gradient3', 'gradient4', 'gradient5',
                          'gradient6', 'gradient7', 'gradient8', 'gradient9', 'gradient10'];
        
        const themes = [
            'AI & Neural Networks', 'Startup Innovation', 'Digital Transformation',
            'Cloud Computing', 'Mobile Technology', 'Blockchain & Crypto',
            'Virtual Reality', 'IoT & Smart Devices', 'Cybersecurity', 'Fintech'
        ];

        const container = document.getElementById('container');
        
        for (let i = 1; i <= 10; i++) {
            const div = document.createElement('div');
            div.className = \`image \${gradients[(i-1) % gradients.length]}\`;
            div.innerHTML = \`
                <div>
                    <div style="font-size: 24px; margin-bottom: 10px;">Tech \${i}</div>
                    <div style="font-size: 14px; opacity: 0.9;">\${themes[i-1]}</div>
                </div>
            \`;
            div.onclick = () => downloadImage(i);
            container.appendChild(div);
        }

        function downloadImage(index) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 300;
            canvas.height = 200;
            
            // Get gradient colors
            const gradientClass = gradients[(index-1) % gradients.length];
            let color1, color2;
            
            switch(gradientClass) {
                case 'gradient1': color1 = '#667eea'; color2 = '#764ba2'; break;
                case 'gradient2': color1 = '#f093fb'; color2 = '#f5576c'; break;
                case 'gradient3': color1 = '#4facfe'; color2 = '#00f2fe'; break;
                case 'gradient4': color1 = '#43e97b'; color2 = '#38f9d7'; break;
                case 'gradient5': color1 = '#fa709a'; color2 = '#fee140'; break;
                case 'gradient6': color1 = '#a8edea'; color2 = '#fed6e3'; break;
                case 'gradient7': color1 = '#ff9a9e'; color2 = '#fecfef'; break;
                case 'gradient8': color1 = '#ffecd2'; color2 = '#fcb69f'; break;
                case 'gradient9': color1 = '#a18cd1'; color2 = '#fbc2eb'; break;
                case 'gradient10': color1 = '#ffecd2'; color2 = '#fcb69f'; break;
            }
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, 300, 200);
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 300, 200);
            
            // Add text
            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(\`Tech \${index}\`, 150, 90);
            
            ctx.font = '14px Arial';
            ctx.fillText(themes[index-1], 150, 120);
            
            // Download
            const link = document.createElement('a');
            link.download = \`tech\${index}.jpg\`;
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
        }
    </script>
</body>
</html>
`;

// Записываем HTML файл
fs.writeFileSync(path.join(__dirname, 'quick_generator.html'), htmlContent);

console.log('✅ Quick generator created: quick_generator.html');
console.log('📝 Instructions:');
console.log('1. Open quick_generator.html in your browser');
console.log('2. Click on each image to download');
console.log('3. Move downloaded files to this folder');
console.log('4. Rename them to tech1.jpg, tech2.jpg, etc.'); 