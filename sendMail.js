import nodemailer from 'nodemailer';

export default function sendMail({ auth, subject, text }, cb) {
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
