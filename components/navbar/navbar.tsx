import { BriefcaseBusiness } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import Container from '../container';
import { auth } from '@/auth';

export default async function Navbar() {
  const sesssion = await auth();

  const isAuth = sesssion?.user?.id;

  return (
    <Container className="pt-1 md:pt-2">
      <header className="flex items-center justify-between">
        <Link className="hover:text-color1 transition-colors" href="/">
          <BriefcaseBusiness size={50} />
        </Link>
        <ul className="flex gap-2">
          <li>
            <Button variant="default" asChild>
              <Link href="sign-in">{isAuth ? 'Auth' : 'Guest'}</Link>
            </Button>
          </li>
          <li>
            <Button variant="default" asChild>
              <Link href="sign-in">Sign In</Link>
            </Button>
          </li>
          <li>
            <Button
              className="bg-color1 hover:bg-color2 hover:text-color3"
              variant="secondary"
              asChild
            >
              <Link href="sign-up">Sign Up</Link>
            </Button>
          </li>
        </ul>
      </header>
    </Container>
  );
}
