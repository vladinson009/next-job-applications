'use server';
// import { Resend } from 'resend';
import nodemailer from 'nodemailer';
// const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

// export async function sendEmail({ to, subject, react }: SendEmailParams) {
//   return resend.emails.send({
//     from: 'Vladimir <onboarding@resend.dev>',
//     to,
//     subject,
//     react,
//   });
// }

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vladinson009@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
export async function sendEmail({ to, subject, html }: SendEmailParams) {
  return await mailer.sendMail({
    to,
    subject,
    from: 'Vladimir Gulev <vladinson009@gmail.com>',
    html,
  });
}
