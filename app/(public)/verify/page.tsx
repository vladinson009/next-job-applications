import { notFound } from 'next/navigation';
import Container from '@/components/container';
import { AlertCircleIcon, CheckCircle2Icon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { validateToken } from '@/features/public/actions';

type SearchParams = { token: string | undefined };
type Props = {
  searchParams: SearchParams;
};
export default async function VerifyTokenPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    notFound();
  }

  let message: string | undefined;
  let title: string | undefined;
  let success: boolean | undefined;

  try {
    const result = await validateToken(token);

    if (!result.success) {
      message = 'Please request a new token';
    } else {
      message = 'Now you can Sign In :)';
    }
    title = result.message;
    success = result.success;
  } catch {}

  return (
    <Container as="section" className="absolute inset-0">
      <Alert
        className={`max-w-1/2 inset-0 left-1/2 top-1/2 -translate-1/2 ${success && 'bg-green-500'}`}
      >
        {success ?
          <CheckCircle2Icon />
        : <AlertCircleIcon />}
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </Container>
  );
}
