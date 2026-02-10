import { requireUser } from '@/lib/auth-server';
import { PropsWithChildren } from 'react';

export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  await requireUser();
  return <>{children}</>;
}
