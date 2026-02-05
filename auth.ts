import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';
import { UsersTable } from './db/schema';
import { compare } from 'bcrypt';
import { eq, or } from 'drizzle-orm';
import { signInSchema } from '@/validations/userValidation';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        password: {},
        credential: {},
      },
      authorize: async (credentials) => {
        const { data, success } = signInSchema.safeParse(credentials);
        if (success === false) {
          return null;
        }
        const { credential, password } = data;
        const [user] = await db
          .select()
          .from(UsersTable)
          .where(
            or(eq(UsersTable.email, credential), eq(UsersTable.name, credential)),
          )
          .limit(1);
        if (!user) return null;
        const isVerified = user.emailVerified;
        // Check with AuthError for custom error messages
        // if (!isVerified) {
        //   return null;
        // }

        if (!user.password) return null;

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
    Google({ allowDangerousEmailAccountLinking: true }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.type === 'credentials') {
      }

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name;
      session.user.email = token.email as string;
      session.user.image = token.image as string;

      return session;
    },
  },
});
