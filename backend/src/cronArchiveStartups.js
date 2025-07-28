const mongoose = require('mongoose');
const Startup = require('./models/Startup');
const StartupUser = require('./models/StartupUser');
const { sendMail } = require('./services/emailService');
require('dotenv').config();

async function archiveOldStartups() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
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
        } catch {}
      }
    }
    console.log(`Стартап ${startup.name} (${startup._id}) архивирован.`);
  }
  await mongoose.disconnect();
}

archiveOldStartups().then(() => {
  console.log('Архивация завершена.');
  process.exit(0);
}).catch(err => {
  console.error('Ошибка архивации:', err);
  process.exit(1);
}); 