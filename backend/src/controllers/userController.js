const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверяем, что все поля заполнены
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения.' });
    }

    // Проверяем, что email не занят
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email уже зарегистрирован.' });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const user = new User({
      name,
      email,
      password: hashedPassword,
      emailVerified: true, // Обычные пользователи не требуют верификации email
      status: 'approved' // Автоматически одобряем
    });

    await user.save();

    res.status(201).json({ 
      message: 'Пользователь успешно зарегистрирован.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Ошибка регистрации пользователя:', err);
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    if (name) user.name = name;
    if (email) {
      // Проверяем, что новый email не занят другим пользователем
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email уже используется.' });
      }
      user.email = email;
    }

    await user.save();
    res.json({ 
      message: 'Профиль обновлен.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
}; 