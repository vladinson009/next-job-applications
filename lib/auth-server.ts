import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const requireUser = cache(async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }
  return session.user;
});

const requestUser = cache(async () => {
  const session = await auth();
  return session?.user;
});

export { requireUser, requestUser };
