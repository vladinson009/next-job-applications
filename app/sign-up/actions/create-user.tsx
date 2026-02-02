'use server';
import type {
  InsertNewUser,
  SafeUserFromDB,
  SignUpOutputSchema,
  ZodServerValidationError,
} from '@/types/User';

import { db } from '@/db';
import { UsersTable } from '@/db/schema';
import { signUpSchema } from '@/validations/userValidation';
import { hash } from 'bcrypt';
import { ZodError } from 'zod';

export async function createUser(
  userInput: SignUpOutputSchema,
): Promise<{ user: SafeUserFromDB; success: boolean }> {
  try {
    // Validate user inputs
    const {
      email,
      password: plainPassword,
      username,
    } = await signUpSchema.parseAsync(userInput);

    // Hash password
    const password = await hash(plainPassword, 12);

    // Insert user into DB
    const [user] = await db
      .insert(UsersTable)
      .values({
        username,
        email,
        password,
      } satisfies InsertNewUser)
      .returning();

    console.log('User from createUser', user);

    const returnValue = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return {
      success: true,
      user: returnValue,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      console.error('Zod Validation failed on the server', err.issues[0]);
      const issues = err.issues.map((i) => ({
        path: i.path.map(String),
        message: i.message,
      }));
      const error = { type: 'validation', issues };
      throw error as ZodServerValidationError;
    }
    console.error('Failed to create user:', err);
    throw {
      type: 'server',
      message: 'Failed to create user',
      originalError: err,
    };
  }
}
