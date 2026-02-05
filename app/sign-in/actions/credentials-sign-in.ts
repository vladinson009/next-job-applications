'use server';
import type { SignInOutputSchema } from '@/types/User';

import { signIn } from '@/auth';
import { isRedirectError } from '@/lib/redirectError';

export async function credentialSignIn(data: SignInOutputSchema) {
  try {
    await signIn('credentials', {
      ...data,
      redirectTo: '/',
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { message: 'Invalid credentials' };
  }
}
