const cron = require('node-cron');
const mongoose = require('mongoose');
const Startup = require('./models/Startup');
const StartupUser = require('./models/StartupUser');
const { sendMail } = require('./services/emailService');
require('dotenv').config();

async function archiveOldStartups() {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const startups = await Startup.find({
      $or: [
        { pitchDeckUrl: { $exists: false } },
        { pitchDeckUrl: '' },
        { pitchDeckUrl: null }
      ],
      createdAt: { $lte: weekAgo },
      status: { $ne: 'archived' }
    });
    
    for (const startup of startups) {
      startup.status = 'archived';
      await startup.save();
      
      // Уведомление (если есть email)
      if (startup.startupUserId) {
        const user = await StartupUser.findById(startup.startupUserId);
        if (user && user.email) {
          try {
            await sendMail(user.email, 'Ваш стартап перемещён в архив',
              `<p>Ваш стартап <b>${startup.name}</b> был автоматически перемещён в архив, так как вы не загрузили pitch deck в течение 7 дней после регистрации.</p>
              <p>Если вы хотите восстановить проект — загрузите pitch deck и обратитесь в поддержку.</p>`
            );
          } catch (error) {
            console.error('Ошибка отправки email:', error);
          }
        }
      }
      console.log(`Стартап ${startup.name} (${startup._id}) архивирован.`);
    }
    
    console.log(`Архивация завершена. Обработано ${startups.length} стартапов.`);
  } catch (error) {
    console.error('Ошибка архивации:', error);
  }
}

// Функция для запуска cron-задачи
const startArchiveCron = () => {
  console.log('⏰ Setting up startup archive cron job (daily at 2:00 AM)...');
  
  cron.schedule('0 2 * * *', () => {
    console.log('🔄 Starting scheduled startup archive...');
    archiveOldStartups();
  }, {
    scheduled: true,
    timezone: "Asia/Almaty"
  });
  
  console.log('✅ Startup archive cron job scheduled successfully');
};

// Экспортируем функции
module.exports = {
  startArchiveCron,
  archiveOldStartups
}; 