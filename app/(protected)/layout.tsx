import { requireUser } from '@/lib/auth-server';
import { PropsWithChildren } from 'react';

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  await requireUser();
  return <>{children}</>;
}
