'use server';
import { db } from '@/db';
import { UsersTable, VerificationTokens } from '@/db/schema';
import { and, eq, gt } from 'drizzle-orm';

export async function validateToken(token: string) {
  const newDate = new Date();
  try {
    const [tokenRow] = await db
      .select({
        identifier: VerificationTokens.identifier,
        expires: VerificationTokens.expires,
      })
      .from(VerificationTokens)
      .where(
        and(
          eq(VerificationTokens.token, token),
          gt(VerificationTokens.expires, newDate),
        ),
      );

    if (!tokenRow) {
      return { success: false, message: 'Invalid or expired token' };
    }

    // Token is valid here

    //Update emailVerified field
    const updateUser = db
      .update(UsersTable)
      .set({ emailVerified: new Date(newDate) })
      .where(eq(UsersTable.email, tokenRow.identifier));

    //Delete token after use
    const deleteToken = db
      .delete(VerificationTokens)
      .where(eq(VerificationTokens.token, token));

    await Promise.all([updateUser, deleteToken]);

    return {
      success: true,
      email: tokenRow.identifier,
      message: 'Successfully verified your email',
    };
  } catch {
    return {
      success: false,
      message: 'Something went wrong',
    };
  }
}
