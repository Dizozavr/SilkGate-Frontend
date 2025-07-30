const Job = require('../models/Job');

// Создание новой вакансии
exports.createJob = async (req, res) => {
  try {
    const { title, company, contact, description, location, salary, requirements } = req.body;
    
    console.log('Полученные данные:', { title, company, contact, description });
    
    // Проверяем обязательные поля (более мягкая валидация)
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Название вакансии обязательно' });
    }
    if (!company || !company.trim()) {
      return res.status(400).json({ message: 'Название компании обязательно' });
    }
    if (!contact || !contact.trim()) {
      return res.status(400).json({ message: 'Контактная информация обязательна' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Описание вакансии обязательно' });
    }
    
    const job = new Job({
      title: title.trim(),
      company: company.trim(),
      contact: contact.trim(),
      description: description.trim(),
      location: location?.trim() || '',
      salary: salary?.trim() || '',
      requirements: requirements?.trim() || '',
      submittedBy: req.user?.email || 'anonymous'
    });
    
    await job.save();
    console.log('Вакансия сохранена:', job._id);
    res.status(201).json({ message: 'Вакансия успешно отправлена на модерацию' });
  } catch (err) {
    console.error('Ошибка создания вакансии:', err);
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

// Получение всех вакансий (для админа)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ submittedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

// Получение одобренных вакансий (для пользователей)
exports.getApprovedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'approved' }).sort({ approvedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

// Получение вакансий на модерации
exports.getPendingJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'pending' }).sort({ submittedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

// Одобрение вакансии
exports.approveJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(
      id, 
      { 
        status: 'approved', 
        approvedAt: new Date(),
        approvedBy: req.user.email || 'admin'
      }, 
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ message: 'Вакансия не найдена' });
    }
    
    res.json({ message: 'Вакансия одобрена', job });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

// Отклонение вакансии
exports.rejectJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(
      id, 
      { 
        status: 'rejected',
        approvedBy: req.user.email || 'admin'
      }, 
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ message: 'Вакансия не найдена' });
    }
    
    res.json({ message: 'Вакансия отклонена', job });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

// Удаление вакансии
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    
    if (!job) {
      return res.status(404).json({ message: 'Вакансия не найдена' });
    }
    
    res.json({ message: 'Вакансия удалена' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
}; 