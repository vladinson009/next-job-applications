import NextAuth, { AuthError } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';
import { UsersTable } from './db/schema';
import { compare } from 'bcrypt';
import { eq, or, sql } from 'drizzle-orm';
import { signInSchema } from '@/validations/userValidation';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { qExistingUserByEmail, insertNewUser } from './db/queries/userQuery';

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
            or(
              eq(UsersTable.email, credential),
              eq(UsersTable.username, credential),
            ),
          )
          .limit(1);
        if (!user || !user.password) {
          return null;
        }

        const isVerified = user.emailVerified;
        // Check with AuthError for custom error messages

        const isValid = await compare(password, user.password);
        if (!isValid) {
          return null;
        }

        if (!isVerified && isValid) {
          throw new AuthError('EMAIL_NOT_VERIFIED');
        }
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          image: user.image,
          name: user.name,
          role: user.role,
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
    // user => Normalized NextAuth user profile
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false;
      }
      if (!account?.provider) {
        return false;
      }

      if (account.provider === 'google' || account.provider === 'github') {
        // Check if the user already exists by email
        const existingUser = await qExistingUserByEmail(user.email);
        if (existingUser) {
          // Merge existing DB info
          user.id = existingUser.id;
          user.username = existingUser.username;
          user.role = existingUser.role;
          user.name = existingUser.name ?? user.name;
          user.image = existingUser.image ?? user.image;
          return true;
        }
        // Auto-create new user
        let baseUsername = profile?.given_name || user.name?.split(' ')[0] || 'user';
        baseUsername = baseUsername.toLowerCase().replace(/\s+/g, '');

        // Fetch all existing usernames that start with baseUsername
        const existingUsernames = await db
          .select({ username: UsersTable.username })
          .from(UsersTable)
          .where(sql`${UsersTable.username} LIKE ${`${baseUsername}%`}`)
          .execute();

        // Create a Set for faster lookup
        const taken = new Set(existingUsernames.map((u) => u.username));

        // Pick a free username
        let username = baseUsername;
        let counter = 1;
        while (taken.has(username)) {
          username = `${baseUsername}${counter++}`;
        }

        const newUser = await insertNewUser({
          email: user.email,
          name: user.name || '',
          username,
          image: user.image || null,
          emailVerified: true,
        });

        user.id = newUser.id;
        user.username = newUser.username;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await qExistingUserByEmail(user.email);

        token.id = dbUser.id;
        token.email = dbUser.email;
        token.username = dbUser.username;
        token.name = dbUser.name;
        token.role = dbUser.role;
        token.image = dbUser.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.username = token.username as string;
      session.user.name = token.name;
      session.user.role = token.role as string;
      session.user.image = token.image as string;

      return session;
    },
  },
});
