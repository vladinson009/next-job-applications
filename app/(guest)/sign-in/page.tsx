import Container from '@/components/container';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import SignInForm from './sign-in-form';
import AuthProvidersCardHeader from '@/components/auth-form/auth-providers-card-header';

export default function SignInPage() {
  return (
    <Container className="my-5 xl:my-15">
      <Card className="text-center mx-auto max-w-100">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Sign In</CardTitle>
          <AuthProvidersCardHeader />
        </CardHeader>

        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-muted-foreground text-sm">
            Dont&apos;t have an account? Sign Up{' '}
            <Link
              className="underline text-foreground hover:no-underline"
              href="/sign-up"
            >
              here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </Container>
  );
}
