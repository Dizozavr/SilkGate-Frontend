# 🚀 Руководство по деплою SilkGate

## 📱 Как сделать приложение доступным на любом устройстве

### Вариант 1: Веб-приложение (Рекомендуется)

#### 1. Деплой на Vercel (Самый простой)

**Шаги:**
1. **Создайте аккаунт на Vercel:**
   - Перейдите на [vercel.com](https://vercel.com)
   - Зарегистрируйтесь через GitHub

2. **Подготовьте проект:**
   ```bash
   # В папке frontend создайте файл vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

3. **Деплой:**
   - Подключите GitHub репозиторий к Vercel
   - Vercel автоматически соберет и развернет приложение
   - Получите URL вида: `https://your-app.vercel.app`

#### 2. Деплой на Netlify

**Шаги:**
1. **Создайте аккаунт на Netlify:**
   - Перейдите на [netlify.com](https://netlify.com)
   - Зарегистрируйтесь через GitHub

2. **Подготовьте проект:**
   ```bash
   # В папке frontend создайте файл _redirects
   /*    /index.html   200
   ```

3. **Деплой:**
   - Подключите GitHub репозиторий
   - Настройте build command: `npm run build`
   - Настройте publish directory: `dist`
   - Получите URL вида: `https://your-app.netlify.app`

#### 3. Деплой на GitHub Pages

**Шаги:**
1. **Создайте файл `.github/workflows/deploy.yml`:**
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v2
       - uses: actions/setup-node@v2
         with:
           node-version: '18'
       - run: |
           cd frontend
           npm install
           npm run build
       - uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./frontend/dist
   ```

2. **Настройте GitHub Pages:**
   - В настройках репозитория включите GitHub Pages
   - Выберите источник: GitHub Actions
   - Получите URL вида: `https://username.github.io/repo-name`

### Вариант 2: PWA (Progressive Web App)

#### 1. Добавьте PWA функциональность

**Создайте файл `frontend/public/manifest.json`:**
```json
{
  "name": "SilkGate",
  "short_name": "SilkGate",
  "description": "Платформа для соединения стартапов и инвесторов",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#3B82F6",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Обновите `frontend/index.html`:**
```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#3B82F6" />
    <link rel="manifest" href="/manifest.json" />
    <title>SilkGate</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### 2. Добавьте Service Worker

**Создайте файл `frontend/public/sw.js`:**
```javascript
const CACHE_NAME = 'silkgate-v1.2';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

**Добавьте регистрацию в `frontend/src/main.jsx`:**
```javascript
// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
```

### Вариант 3: Мобильное приложение

#### 1. Используйте Capacitor (Рекомендуется)

**Установите Capacitor:**
```bash
cd frontend
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init
```

**Настройте Android:**
```bash
npx cap add android
npx cap sync
npx cap open android
```

**Соберите APK:**
```bash
# В Android Studio
Build -> Build Bundle(s) / APK(s) -> Build APK(s)
```

#### 2. Используйте PWA Builder

1. Перейдите на [pwa-builder.com](https://pwa-builder.com)
2. Введите URL вашего веб-приложения
3. Скачайте готовые APK файлы для Android

### Вариант 4: Гибридное решение

#### 1. Веб + PWA + Мобильное приложение

**Преимущества:**
- ✅ Один код для всех платформ
- ✅ Легкое обновление
- ✅ Низкая стоимость разработки
- ✅ Быстрый деплой

**Архитектура:**
```
Веб-приложение (Vercel/Netlify)
    ↓
PWA (установка на устройство)
    ↓
Мобильное приложение (Capacitor)
```

## 🔧 Настройка бэкенда

### 1. Деплой бэкенда на Railway

**Шаги:**
1. Создайте аккаунт на [railway.app](https://railway.app)
2. Подключите GitHub репозиторий
3. Настройте переменные окружения:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```
4. Получите URL вида: `https://your-backend.railway.app`

### 2. Обновите API URL в frontend

**В `frontend/src/config/api.js`:**
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend.railway.app/api'
  : 'http://localhost:3000/api';

export default API_BASE_URL;
```

## 📱 Тестирование на Android

### 1. Веб-браузер
- Откройте Chrome на Android
- Перейдите по URL вашего приложения
- Добавьте на главный экран (PWA)

### 2. Мобильное приложение
- Установите APK файл
- Запустите приложение

## 🚀 Рекомендуемый план деплоя

### Этап 1: Веб-приложение (1-2 часа)
1. Деплой frontend на Vercel
2. Деплой backend на Railway
3. Настройка CORS и переменных окружения
4. Тестирование на мобильных устройствах

### Этап 2: PWA (2-3 часа)
1. Добавление manifest.json
2. Настройка Service Worker
3. Создание иконок
4. Тестирование установки на Android

### Этап 3: Мобильное приложение (1-2 дня)
1. Настройка Capacitor
2. Создание Android проекта
3. Настройка иконок и splash screen
4. Сборка APK

## 💰 Стоимость деплоя

### Бесплатные варианты:
- ✅ Vercel: бесплатно до 100GB трафика
- ✅ Netlify: бесплатно до 100GB трафика
- ✅ GitHub Pages: бесплатно
- ✅ Railway: бесплатно до $5 в месяц

### Платные варианты:
- 🔸 Vercel Pro: $20/месяц
- 🔸 Netlify Pro: $19/месяц
- 🔸 Railway: $5-50/месяц

## 🎯 Рекомендации

### Для быстрого старта:
1. **Деплой на Vercel** - самый простой способ
2. **Добавьте PWA** - для установки на Android
3. **Настройте бэкенд** на Railway

### Для продакшена:
1. **Используйте платные планы** для стабильности
2. **Настройте мониторинг** и логирование
3. **Добавьте CDN** для быстрой загрузки
4. **Настройте SSL** сертификаты

---

*Руководство создано для SilkGate v1.2* 