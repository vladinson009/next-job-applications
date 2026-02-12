import { eq } from 'drizzle-orm';
import { db } from '..';
import { UsersTable } from '../schema';

type InsertUserType = {
  email: string;
  username: string;
  name: string;
  image: string | null;
};

export async function qExistingUserByEmail(email: string) {
  const [existingUser] = await db
    .select()
    .from(UsersTable)
    .where(eq(UsersTable.email, email))
    .limit(1);

  return existingUser;
}
export async function qInsertNewUser(user: InsertUserType) {
  const [newUser] = await db
    .insert(UsersTable)
    .values({
      email: user.email,
      username: user.username,
      name: user.name,
      image: user.image,
    })
    .returning();

  return newUser;
}
