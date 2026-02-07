'use client';

import { providerSignIn } from '@/app/auth/actions/provider-sign-in';
import { Button } from '@/components/ui/button';
import { Providers } from '@/types/Providers';
import { PropsWithChildren } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function ProviderBtn({
  children,
  provider,
  imgSrc,
}: PropsWithChildren<{ provider: Providers; imgSrc: string }>) {
  return (
    <Button variant="outline" onClick={providerSignIn.bind(null, provider)}>
      <Avatar size="sm">
        <AvatarImage src={imgSrc} />
        <AvatarFallback>{children}</AvatarFallback>
      </Avatar>
    </Button>
  );
}
