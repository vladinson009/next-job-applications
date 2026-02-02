import { UsersTable } from '@/db/schema';
import { signUpSchema } from '@/validations/userValidation';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import z from 'zod';

type UserFromDB = InferSelectModel<typeof UsersTable>; // full row type
export type InsertNewUser = InferInsertModel<typeof UsersTable>; // type for insert
export type SafeUserFromDB = Omit<
  UserFromDB,
  'password' | 'emailVerified' | 'image' | 'age'
>;

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignUpOutputSchema = z.output<typeof signUpSchema>;

//! Error types:
export type ZodServerValidationError = {
  type: 'validation';
  issues: Array<{
    path: string[]; // field names e.g., ['email'] or ['passwordConfirm']
    message: string;
  }>;
};

export type CreateUserError =
  | ZodServerValidationError
  | { type: 'server'; message: string; originalError?: unknown };
