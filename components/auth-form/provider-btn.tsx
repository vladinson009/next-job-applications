'use client';

import { Button } from '@/components/ui/button';
import { Providers } from '@/types/Providers';
import { PropsWithChildren, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { providerSignIn } from '@/features/auth/actions';

export default function ProviderBtn({
  children,
  provider,
  imgSrc,
}: PropsWithChildren<{ provider: Providers; imgSrc: string }>) {
  const [isLoading, setIsLoading] = useState(false);

  async function onProviderSignIn() {
    setIsLoading(true);
    await providerSignIn(provider);
    setIsLoading(false);
  }

  return (
    <Button disabled={isLoading} variant="outline" onClick={onProviderSignIn}>
      <Avatar size="sm">
        <AvatarImage src={imgSrc} />
        <AvatarFallback>{children}</AvatarFallback>
      </Avatar>
    </Button>
  );
}
