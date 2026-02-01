import Container from '@/components/container';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SignUpForm from './sign-up-form';

export default function SignUpPage() {
  return (
    <Container className="my-5 xl:my-15">
      <Card className="text-center mx-auto max-w-1/2">
        <CardHeader className="">
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Sign up by email or some of our providers.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className="justify-center">
          <p>Footer</p>
        </CardFooter>
      </Card>
    </Container>
  );
}
