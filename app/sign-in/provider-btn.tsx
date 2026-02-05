'use client';

import { Button } from '@/components/ui/button';
import { PropsWithChildren } from 'react';
import { Providers, providerSignIn } from './actions/provider-sign-in';

export default function ProviderBtn({
  children,
  provider,
}: PropsWithChildren<{ provider: Providers }>) {
  return <Button onClick={providerSignIn.bind(null, provider)}>{children}</Button>;
}
