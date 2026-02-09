'use client';

import { Button } from '@/components/ui/button';
import { Providers } from '@/types/Providers';
import { PropsWithChildren } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { providerSignIn } from '@/features/auth/actions';

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
