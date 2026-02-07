'use server';
import type { SignInOutputSchema } from '@/types/User';

import { signIn } from '@/auth';
import { isRedirectError } from '@/lib/redirectError';
import { AuthError } from 'next-auth';
import { db } from '@/db';
import { UsersTable } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

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
    if (error instanceof AuthError && error.message.includes('EMAIL_NOT_VERIFIED')) {
      const [user] = await db
        .select({ name: UsersTable.name, email: UsersTable.email })
        .from(UsersTable)
        .where(
          or(
            eq(UsersTable.email, data.credential),
            eq(UsersTable.name, data.credential),
          ),
        )
        .limit(1);

      return { reason: 'emailVerified', message: 'Please verify your email', user };
    }
    return { reason: 'credentials', message: 'Invalid credentials' };
  }
}
