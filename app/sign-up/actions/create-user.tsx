'use server';

import type { UserResponse, InsertNewUser, SignUpOutputSchema } from '@/types/User';
import type { ActionError } from '@/types/Error';

import { db } from '@/db';
import { UsersTable } from '@/db/schema';
import { signUpSchema } from '@/validations/userValidation';
import { hash } from 'bcrypt';
import { eq, or } from 'drizzle-orm';
import { $ZodIssue } from 'zod/v4/core';

export async function createUser(
  userInput: SignUpOutputSchema,
): Promise<UserResponse> {
  try {
    // Validate user inputs with zod
    const parsedData = signUpSchema.safeParse(userInput);

    // Zod validation error
    if (parsedData.success === false) {
      const issues = parsedData.error.issues;
      const type = 'validation';
      const error: ActionError = { type, issues };

      console.error('Zod Validation failed on the server', issues[0].message);
      return {
        success: false,
        error,
      };
    }
    const { email, password, name } = parsedData.data;

    // Check for existing user
    const [existingUser] = await db
      .select({ email: UsersTable.email, name: UsersTable.name })
      .from(UsersTable)
      .where(or(eq(UsersTable.email, email), eq(UsersTable.name, name)))
      .limit(1);

    if (existingUser) {
      const issues: $ZodIssue[] = [];
      const existingEmail = existingUser.email === email;
      const existingUsername = existingUser.name === name;

      if (existingEmail) {
        issues.push({
          path: ['email'],
          message: 'Email already exist',
          code: 'custom',
        });
      }
      if (existingUsername) {
        issues.push({
          path: ['name'],
          message: 'Username already exist',
          code: 'custom',
        });
      }

      const error = {
        type: 'validation',
        issues,
      } satisfies ActionError;
      return {
        success: false,
        error,
      };
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Insert user into DB
    const [user] = await db
      .insert(UsersTable)
      .values({
        name,
        email,
        password: hashedPassword,
      } satisfies InsertNewUser)
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...returnValue } = user;
    return {
      success: true,
      user: returnValue,
    };
  } catch (err) {
    //Internal server error
    console.error('Failed to create user:', err);

    return {
      success: false,
      error: {
        type: 'server',
        message: "Can't create an user. It's on us",
      } satisfies ActionError,
    };
  }
}
