const Investor = require('../models/Investor');
const Startup = require('../models/Startup');
const { sendVerificationEmail } = require('../services/emailService');
const nodemailer = require('nodemailer');

exports.getPendingInvestors = async (req, res) => {
  const investors = await Investor.find({ status: 'pending' });
  res.json(investors);
};

exports.approveInvestor = async (req, res) => {
  const { id } = req.params;
  const investor = await Investor.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
  if (!investor) return res.status(404).json({ message: 'Investor not found' });

  // Отправить письмо о доступе
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: investor.email,
      subject: 'Доступ к SilkGate одобрен',
      html: `<p>Здравствуйте!</p>
             <p>Ваша заявка на доступ к SilkGate одобрена.</p>
             <p>Теперь вы можете войти на платформу и просматривать проекты.</p>
             <p>Если возникнут вопросы — пишите нам.</p>
             <p>Добро пожаловать в закрытое сообщество SilkGate!</p>`
    });
  } catch (err) {
    console.error('Ошибка отправки письма инвестору:', err);
  }

  res.json({ message: 'Investor approved', investor });
};

exports.rejectInvestor = async (req, res) => {
  const { id } = req.params;
  const investor = await Investor.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
  if (!investor) return res.status(404).json({ message: 'Investor not found' });

  // Отправить письмо об отказе
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: investor.email,
      subject: 'Заявка на SilkGate отклонена',
      html: `<p>Здравствуйте!</p>
             <p>Спасибо за интерес к SilkGate.</p>
             <p>К сожалению, на данный момент мы не можем предоставить вам доступ к платформе.</p>
             <p>Если у вас есть вопросы или вы хотите узнать причину отказа — напишите нам в ответ на это письмо.</p>
             <p>С уважением, команда SilkGate</p>`
    });
  } catch (err) {
    console.error('Ошибка отправки письма инвестору (отказ):', err);
  }

  res.json({ message: 'Investor rejected', investor });
};

exports.getPendingStartups = async (req, res) => {
  const startups = await Startup.find({ status: 'pending' });
  res.json(startups);
};

exports.approveStartup = async (req, res) => {
  const { id } = req.params;
  const startup = await Startup.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
  if (!startup) return res.status(404).json({ message: 'Startup not found' });
  res.json({ message: 'Startup approved', startup });
};

exports.rejectStartup = async (req, res) => {
  const { id } = req.params;
  const startup = await Startup.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
  if (!startup) return res.status(404).json({ message: 'Startup not found' });
  res.json({ message: 'Startup rejected', startup });
}; 