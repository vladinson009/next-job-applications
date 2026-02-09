import { requestUser } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function GuestLayout({ children }: PropsWithChildren) {
  const user = await requestUser();
  if (user) {
    redirect('/');
  }
  return <>{children}</>;
}
