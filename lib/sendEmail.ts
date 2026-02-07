'use server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailParams = {
  to: string;
  subject: string;
  react: React.ReactElement;
};

export async function sendEmail({ to, subject, react }: SendEmailParams) {
  return resend.emails.send({
    from: 'Vladimir <onboarding@resend.dev>',
    to,
    subject,
    react,
  });
}
