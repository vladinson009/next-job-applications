import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['user', 'admin', 'moderator']);

export const UsersTable = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),

  // Custom fields
  password: varchar('password', { length: 255 }),
  role: roleEnum('role').notNull().default('user'),
  age: integer('age'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const AccountsTable = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => UsersTable.id, { onDelete: 'cascade' }),

    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    expiresAt: integer('expires_at'),
    tokenType: text('token_type'),
    scope: text('scope'),
    idToken: text('id_token'),
    sessionState: text('session_state'),
  },
  (table) => [
    primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  ],
);
// verificationTokens (only if email login)

export const VerificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.identifier, table.token] }),
    uniqueIndex('verification_tokens_identifier_unique').on(table.identifier),
  ],
);
