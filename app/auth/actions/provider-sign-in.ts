'use server';

import { signIn } from '@/auth';
import { isRedirectError } from '@/lib/redirectError';
import { Providers } from '@/types/Providers';

export async function providerSignIn(provider: Providers) {
  try {
    await signIn(provider, {
      redirectTo: '/',
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { message: 'Invalid credentials' };
  }
}
