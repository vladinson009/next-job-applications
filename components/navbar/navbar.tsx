import { BriefcaseBusiness } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import Container from '../container';
import { auth } from '@/auth';
import AvatarMenu from './avatar-menu';

export default async function Navbar() {
  const sesssion = await auth();

  const user = sesssion?.user;
  const isAuth = user?.id;
  console.log(user);

  return (
    <Container className="pt-1 md:pt-2">
      <header className="flex items-center justify-between">
        <Link className="hover:text-primary transition-colors" href="/">
          <BriefcaseBusiness size={50} />
        </Link>
        <ul className="flex gap-2 items-center">
          {!isAuth && (
            <>
              <li>
                <Button variant="default" asChild>
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
              </li>
              {/* <li>
                <Button
                  className="hover:bg-color2 hover:text-color3"
                  variant="outline"
                  asChild
                >
                  <Link href="/auth/sign-up">Sign Up</Link>
                </Button>
              </li> */}
            </>
          )}
          {!!isAuth && (
            <li>
              <AvatarMenu user={user} />
            </li>
          )}
        </ul>
      </header>
    </Container>
  );
}
