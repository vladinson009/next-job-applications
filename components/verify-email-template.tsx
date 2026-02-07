import { Button } from './ui/button';

type Props = {
  name: string;
  verifyUrl: string;
};

export function VerifyEmailTemplate({ name, verifyUrl }: Props) {
  return (
    <section>
      <h1>Hello {name} 👋</h1>
      <p>Please verify your email by clicking the link below:</p>

      <a href={verifyUrl}>Verify email</a>

      <p>This link expires in 24 hours.</p>

      <p>&copy; Job Applications {new Date().getFullYear()}. All rights reserverd</p>
    </section>
  );
}
