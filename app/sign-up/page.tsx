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
import SignUpForm from './sign-up-form';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <Container className="my-5 xl:my-15">
      <Card className="text-center mx-auto max-w-100">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Sign up by email or some of our providers.
          </CardDescription>
          <CardAction></CardAction>
        </CardHeader>

        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-muted-foreground text-sm">
            Already have an account? Sign In{' '}
            <Link
              className="underline text-foreground hover:no-underline"
              href="/sign-in"
            >
              here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </Container>
  );
}
