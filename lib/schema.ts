import { pgTable, serial, varchar, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

// Import neon_auth table for FK references (but don't re-export it!)
// This is the key - Drizzle only generates migrations for EXPORTED tables
import { neonAuthUser } from './neon-auth-schema';

/**
 * YOUR APPLICATION TABLES
 * 
 * These tables are managed by Drizzle and live in the 'public' schema.
 * 
 * To reference neon_auth.user, use .references(() => neonAuthUser.id).
 * The neonAuthUser table is imported but NOT exported, so Drizzle won't
 * try to manage it in migrations.
 * 
 * Workflow:
 * 1. Define your tables here
 * 2. Run `bun run db:generate` to create migrations
 * 3. Run `bun run db:migrate` to apply migrations
 */

// Example: User profile table that extends Neon Auth user data
// export const userProfiles = pgTable('user_profiles', {
//   id: serial('id').primaryKey(),
//   // Reference the Neon Auth user - creates proper FK constraint
//   userId: uuid('user_id')
//     .notNull()
//     .unique()
//     .references(() => neonAuthUser.id, { onDelete: 'cascade' }),
//   bio: text('bio'),
//   username: varchar('username', { length: 50 }).unique(),
//   avatarUrl: text('avatar_url'),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').defaultNow().notNull(),
// });

// Example: Posts table with author reference to Neon Auth user
// export const posts = pgTable('posts', {
//   id: serial('id').primaryKey(),
//   title: varchar('title', { length: 255 }).notNull(),
//   content: text('content'),
//   published: boolean('published').default(false).notNull(),
//   // Reference the Neon Auth user directly
//   authorId: uuid('author_id')
//     .notNull()
//     .references(() => neonAuthUser.id, { onDelete: 'cascade' }),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').defaultNow().notNull(),
// });

// Type exports
// export type UserProfile = typeof userProfiles.$inferSelect;
// export type NewUserProfile = typeof userProfiles.$inferInsert;
// export type Post = typeof posts.$inferSelect;
// export type NewPost = typeof posts.$inferInsert;

/**
 * Re-export neon auth TYPES only (not tables!) for convenience.
 * 
 * For querying neon_auth tables with Drizzle, import tables from './neon-auth-schema':
 * 
 *   import { neonAuthUser } from './neon-auth-schema';
 *   const user = await db.select().from(neonAuthUser).where(eq(neonAuthUser.id, id));
 */
export type {
  NeonAuthUser,
  NeonAuthSession,
  NeonAuthAccount,
  NeonAuthVerification,
  NeonAuthOrganization,
  NeonAuthMember,
  NeonAuthInvitation,
} from './neon-auth-schema';
