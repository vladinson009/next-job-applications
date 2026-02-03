import { UsersTable } from '@/db/schema';
import { signInSchema, signUpSchema } from '@/validations/userValidation';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import z from 'zod';
import { ActionError } from './Error';

type UserFromDB = InferSelectModel<typeof UsersTable>; // full row type
export type InsertNewUser = InferInsertModel<typeof UsersTable>; // type for insert
export type SafeUserFromDB = Omit<
  UserFromDB,
  'password' | 'emailVerified' | 'image' | 'age'
>;

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignUpOutputSchema = z.output<typeof signUpSchema>;

export type UserResponse =
  | { success: true; user: SafeUserFromDB }
  | { success: false; error: ActionError };

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignInOutputSchema = z.output<typeof signInSchema>;
