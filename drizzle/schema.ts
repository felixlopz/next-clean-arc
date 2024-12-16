import {
  pgTable,
  text,
  varchar,
  pgEnum,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';

export const userRole = pgEnum('userRole', ['user', 'admin']);

export const users = pgTable('users', {
  id: text('id').primaryKey().notNull(), // UUID or other unique identifier
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRole().default('user').notNull(),
  emailVerified: integer().notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(), // Default timestamp
});

export const userRoleSchema = createSelectSchema(userRole);

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(users);

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: integer('expires_at').notNull(),
});

export const emailVerificationRequests = pgTable('emailVerificationRequests', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  email: text('email').notNull(),
  code: text('code').notNull(),
  expiresAt: integer('expires_at').notNull(),
});
