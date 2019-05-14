import nodemailer from 'nodemailer';

export function sendMail({ auth, subject, text }, cb) {
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

  transporter.sendMail(
    {
      from: auth.user,
      to: auth.to,
      subject,
      text
    },
    err => {
      if (err) return console.log(err.message);
      cb();
    }
  );
}

export function formatDate(date) {
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
