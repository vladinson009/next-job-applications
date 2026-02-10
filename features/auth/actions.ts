'use server';

import type {
  UserResponse,
  InsertNewUser,
  SignUpOutputSchema,
  SignInOutputSchema,
} from '@/types/User';
import type { ActionError } from '@/types/Error';

import { db } from '@/db';
import { UsersTable } from '@/db/schema';
import { signUpSchema } from '@/validations/userValidation';
import { hash } from 'bcrypt';
import { eq, or } from 'drizzle-orm';
import { $ZodIssue } from 'zod/v4/core';
import { generateVerificationToken } from '@/lib/generateVerificationToken';
import { sendEmail } from '@/lib/sendEmail';
import { redirect } from 'next/navigation';
import { isRedirectError } from '@/lib/redirectError';
import { emailText } from '@/constants/emailVerification';
import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { Providers } from '@/types/Providers';

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

    // Create verification token and push in DB
    const token = await generateVerificationToken(email);
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

    // Send verifying email
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: emailText(verifyUrl, user.name),
    });

    redirect('/');
  } catch (err) {
    if (isRedirectError(err)) throw err;
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

export async function logoutAction() {
  await signOut({ redirectTo: '/auth/sign-in' });
}
