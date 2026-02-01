import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';
import { UsersTable } from './db/schema';
import { compare } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { signInSchema } from '@/validations/userValidation';
import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = await signInSchema.parseAsync(credentials);

        const [user] = await db
          .select()
          .from(UsersTable)
          .where(eq(UsersTable.email, email))
          .limit(1);
        if (!user) return null;
        const isVerified = user.emailVerified;

        if (!isVerified) {
          return null;
        }
        if (!user.password) {
          return null;
        }
        const isValid = await compare(password, user.password);

        if (!isValid) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
  ],
  session: {
    strategy: 'jwt',
  },
});
