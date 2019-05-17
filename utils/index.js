import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import inlineBase64 from 'nodemailer-plugin-inline-base64';

dotenv.config();

const { AUTH_USER, AUTH_PASS, AUTH_TO } = process.env;
const auth = {
  user: AUTH_USER,
  pass: AUTH_PASS,
  to: AUTH_TO
};

export function sendMail({ subject, html }, cb) {
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    secureConnection: false,
    port: 587,
    tls: {
      ciphers: 'SSLv3'
    },
    auth: {
      user: auth.user,
      pass: auth.pass
    }
  });

  transporter.use(
    'compile',
    inlineBase64({ cid: `coderfee_id_${Date.now()}` })
  );

  transporter.sendMail(
    {
      from: auth.user,
      to: auth.to,
      subject: `${subject}`,
      html
    },
    err => {
      if (err) return console.log(err.message);
      cb();
    }
  );
}

export function formatDateTime(date) {
  date = new Date(date);
  return Intl.DateTimeFormat('zh-cmn-Hans', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Shanghai'
  }).format(date);
}
