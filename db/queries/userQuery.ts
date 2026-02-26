'use server';
import { eq } from 'drizzle-orm';
import { db } from '..';
import { UsersTable } from '../schema';
import { requireUser } from '@/lib/auth-server';
import { compare, hash } from 'bcrypt';
import { SALT_ROUNDS } from '@/constants/auth';
import {
  changeBirthdaySchema,
  changePasswordSchema,
  changeUsernameSchema,
  passwordMatchSchema,
} from '@/validations/userValidation';
import {
  ChangePasswordSchema,
  ChangeUserBirthdaySchema,
  ChangeUsernameSchema,
  SetPasswordSchema,
} from '@/types/UserInfoUpdate';
import z from 'zod';
import { revalidatePath } from 'next/cache';
import { formatDateForDB } from '@/lib/dataFormatter';

type InsertUserType = {
  email: string;
  username: string;
  name: string;
  image: string | null;
  emailVerified?: boolean;
};

export async function qExistingUserByEmail(email: string) {
  const [existingUser] = await db
    .select()
    .from(UsersTable)
    .where(eq(UsersTable.email, email))
    .limit(1);

  return existingUser;
}
export async function insertNewUser(user: InsertUserType) {
  const [newUser] = await db
    .insert(UsersTable)
    .values({
      email: user.email,
      username: user.username,
      name: user.name,
      image: user.image,
      emailVerified: user.emailVerified ? new Date() : null,
    })
    .returning();

  return newUser;
}
export async function changePassword(values: ChangePasswordSchema) {
  const parsedData = changePasswordSchema.safeParse(values);
  if (!parsedData.success) {
    return { success: false, error: parsedData.error.message };
  }
  const { oldPassword, password } = parsedData.data;

  const user = await requireUser();

  try {
    const [userFromDB] = await db
      .select({ password: UsersTable.password })
      .from(UsersTable)
      .where(eq(UsersTable.id, user.id))
      .limit(1);

    if (!userFromDB) {
      return { success: false, error: 'No user found' };
    }
    if (!userFromDB.password) {
      return { success: false, error: 'No password found in DB' };
    }
    const isPasswordMatch = await compare(oldPassword, userFromDB.password);
    if (!isPasswordMatch) {
      return {
        success: false,
        fieldErrors: { oldPassword: ['Incorrect password'] },
      };
    }
    const hashedPassword = await hash(password, SALT_ROUNDS);

    await db
      .update(UsersTable)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(UsersTable.id, user.id));

    return { success: true };
  } catch (error) {
    console.error('[changePassword]:', error);

    return { success: false, error: 'Internal server error' };
  }
}

export async function setPassword(values: SetPasswordSchema) {
  const parsedData = passwordMatchSchema.safeParse(values);
  if (!parsedData.success) {
    return { success: false, error: parsedData.error.message };
  }
  const { password } = parsedData.data;

  const user = await requireUser();
  try {
    const hashedPassword = await hash(password, SALT_ROUNDS);

    await db
      .update(UsersTable)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(UsersTable.id, user.id));

    return { success: true };
  } catch (error) {
    console.error('[setPassword]:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}
export async function changeBirthdayDate(values: ChangeUserBirthdaySchema) {
  const parsedData = changeBirthdaySchema.safeParse(values);
  if (!parsedData.success) {
    const tree = z.treeifyError(parsedData.error);
    const properties = tree.properties;
    const error = Object.entries(properties || {}).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value?.errors?.length) {
          acc[key] = value.errors[0];
        }
        return acc;
      },
      {},
    );

    return { success: false, error };
  }
  const { birthday } = parsedData.data;

  const user = await requireUser();

  try {
    await db
      .update(UsersTable)
      .set({ birthday: formatDateForDB(birthday), updatedAt: new Date() })
      .where(eq(UsersTable.id, user.id));
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('[changeBirthdayDate]:', error);

    return { success: false, error: 'Internal server error' };
  }
}
export async function changeUsername(values: ChangeUsernameSchema) {
  const parsedData = changeUsernameSchema.safeParse(values);
  if (!parsedData.success) {
    const error = parsedData.error.message;
    return { success: false, error };
  }
  const { username } = parsedData.data;

  const user = await requireUser();

  const [userQuery] = await db
    .select({ username: UsersTable.username })
    .from(UsersTable)
    .where(eq(UsersTable.username, username))
    .limit(1);
  if (userQuery) {
    return { success: false, error: 'Username is taken' };
  }

  try {
    await db
      .update(UsersTable)
      .set({ username, updatedAt: new Date() })
      .where(eq(UsersTable.id, user.id));
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('[changeUsername]:', error);

    return { success: false, error: 'Internal server error' };
  }
}
