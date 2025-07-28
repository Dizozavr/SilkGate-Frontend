const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(to, link) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'SilkGate Email Verification',
    html: `<p>Thank you for registering on SilkGate!</p>
           <p>Please verify your email by clicking the link below:</p>
           <a href="${link}">${link}</a>`
  };
  await transporter.sendMail(mailOptions);
}

async function sendPasswordResetEmail(to, link) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Восстановление пароля SilkGate',
    html: `<p>Вы запросили восстановление пароля на SilkGate.</p>
           <p>Для сброса пароля перейдите по ссылке:</p>
           <a href="${link}">${link}</a>
           <p>Если вы не запрашивали восстановление, просто проигнорируйте это письмо.</p>`
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Письмо для восстановления пароля отправлено:', to);
  } catch (err) {
    console.error('Ошибка отправки письма восстановления пароля:', err);
    throw err;
  }
}

async function sendMail(to, subject, html) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Письмо отправлено:', to, subject);
  } catch (err) {
    console.error('Ошибка отправки письма:', err);
    throw err;
  }
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendMail }; 