import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';
import { UsersTable } from './db/schema';
import { compare } from 'bcrypt';
import { eq, or } from 'drizzle-orm';
import { signInSchema } from '@/validations/userValidation';
import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        credential: {},
      },
      authorize: async (credentials) => {
        const { credential, password } = await signInSchema.parseAsync(credentials);
        const [user] = await db
          .select()
          .from(UsersTable)
          .where(
            or(
              eq(UsersTable.email, credential),
              eq(UsersTable.username, credential),
            ),
          )
          .limit(1);
        if (!user) return null;
        const isVerified = user.emailVerified;
        // Check with AuthError for custom error messages
        // if (!isVerified) {
        //   return null;
        // }

        if (!user.password) {
          return null;
        }
        const isValid = await compare(password, user.password);

        if (!isValid) return null;
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
});
