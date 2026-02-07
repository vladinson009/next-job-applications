'use server';
import { db } from '@/db';
import { VerificationTokens } from '@/db/schema';
import crypto from 'crypto';

export async function generateVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString('hex');

  const expirePeriod = Date.now() + 24 * 60 * 60 * 1000; // 24 Hours
  const expires = new Date(expirePeriod);

  await db
    .insert(VerificationTokens)
    .values({
      identifier: email,
      token,
      expires,
    })
    .onConflictDoUpdate({
      target: VerificationTokens.identifier,
      set: {
        token,
        expires,
      },
    });
  return token;
}
