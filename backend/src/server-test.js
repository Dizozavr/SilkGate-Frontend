const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Тестовый endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SilkGate backend is running.' });
});

// Тестовый endpoint для регистрации пользователей
app.post('/api/users/register', (req, res) => {
  console.log('Register request:', req.body);
  res.status(201).json({ 
    message: 'Пользователь успешно зарегистрирован.',
    user: {
      id: 'test-id',
      name: req.body.name,
      email: req.body.email
    }
  });
});

// Тестовый endpoint для входа
app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  res.json({ 
    token: 'test-token-123',
    role: 'user',
    name: req.body.email
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}); 