import Container from '@/components/container';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import SignInForm from './sign-in-form';
// import SignUpForm from './sign-up-form';

export default function SignInPage() {
  return (
    <Container className="my-5 xl:my-15">
      <Card className="text-center mx-auto max-w-100">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Sign in by email or some of our providers.
          </CardDescription>
          <CardAction></CardAction>
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
