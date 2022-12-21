/* eslint-disable import/prefer-default-export */
import nodemailer, { Transporter } from 'nodemailer';

export async function sendMailService(
  email: string,
  html: string,
  title: string
) {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      name: process.env.SMTP_HOST,
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_HOST),
      auth: {
        user: process.env.SMTP_LOGIN,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `Eu Pescador <${process.env.SMTP_LOGIN}>`,
      to: email,
      subject: title,
      html,
    });

    transporter.close();
  } catch (err) {
    throw new Error('Falha ao enviar email!');
  }
}
