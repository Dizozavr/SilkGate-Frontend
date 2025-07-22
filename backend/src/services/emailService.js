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

module.exports = { sendVerificationEmail }; 