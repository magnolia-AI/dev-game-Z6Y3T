/**
 * Neon Auth Schema
 * 
 * This file contains the Drizzle schema definitions for the neon_auth schema,
 * which is managed by Neon Auth. DO NOT modify this file - the schema is
 * automatically created and managed by Neon when auth is enabled.
 * 
 * Usage in your schema:
 *   import { neonAuthUser } from './neon-auth-schema';
 *   
 *   export const posts = pgTable('posts', {
 *     id: serial('id').primaryKey(),
 *     authorId: uuid('author_id')
 *       .notNull()
 *       .references(() => neonAuthUser.id, { onDelete: 'cascade' }),
 *     // ... your fields
 *   });
 */

import { pgSchema, uuid, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// Define the neon_auth schema (managed by Neon Auth)
export const neonAuthSchema = pgSchema('neon_auth');

// =============================================================================
// CORE TABLES
// =============================================================================

/**
 * The user table - main user identity table.
 * This is the primary table you'll reference for foreign keys.
 */
export const neonAuthUser = neonAuthSchema.table('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
  role: text('role'),
  banned: boolean('banned'),
  banReason: text('banReason'),
  banExpires: timestamp('banExpires', { withTimezone: true }),
});

/**
 * The session table - active user sessions.
 */
export const neonAuthSession = neonAuthSchema.table('session', {
  id: uuid('id').primaryKey().defaultRandom(),
  expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: uuid('userId').notNull().references(() => neonAuthUser.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonatedBy'),
  activeOrganizationId: text('activeOrganizationId'),
});

/**
 * The account table - OAuth/social login connections.
 */
export const neonAuthAccount = neonAuthSchema.table('account', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: uuid('userId').notNull().references(() => neonAuthUser.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', { withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
});

/**
 * The verification table - email/phone verification tokens.
 */
export const neonAuthVerification = neonAuthSchema.table('verification', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
});

// =============================================================================
// ORGANIZATION TABLES (for team/multi-tenant features)
// =============================================================================

/**
 * The organization table - teams/workspaces.
 */
export const neonAuthOrganization = neonAuthSchema.table('organization', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  metadata: text('metadata'),
});

/**
 * The member table - organization membership (user <-> org relationship).
 */
export const neonAuthMember = neonAuthSchema.table('member', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organizationId').notNull().references(() => neonAuthOrganization.id, { onDelete: 'cascade' }),
  userId: uuid('userId').notNull().references(() => neonAuthUser.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
});

/**
 * The invitation table - pending org invitations.
 */
export const neonAuthInvitation = neonAuthSchema.table('invitation', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organizationId').notNull().references(() => neonAuthOrganization.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role'),
  status: text('status').notNull(),
  expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  inviterId: uuid('inviterId').notNull().references(() => neonAuthUser.id, { onDelete: 'cascade' }),
});

// =============================================================================
// INTERNAL TABLES (typically not referenced directly)
// =============================================================================

/**
 * The jwks table - JSON Web Key Sets for token signing.
 * Internal use - you typically don't need to reference this.
 */
export const neonAuthJwks = neonAuthSchema.table('jwks', {
  id: uuid('id').primaryKey().defaultRandom(),
  publicKey: text('publicKey').notNull(),
  privateKey: text('privateKey').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  expiresAt: timestamp('expiresAt', { withTimezone: true }),
});

/**
 * The project_config table - Neon Auth project configuration.
 * Internal use - managed by Neon, you don't need to reference this.
 */
export const neonAuthProjectConfig = neonAuthSchema.table('project_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  endpoint_id: text('endpoint_id').notNull().unique(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  trusted_origins: jsonb('trusted_origins').notNull(),
  social_providers: jsonb('social_providers').notNull(),
  email_provider: jsonb('email_provider'),
  email_and_password: jsonb('email_and_password'),
  allow_localhost: boolean('allow_localhost').notNull(),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// Core types
export type NeonAuthUser = typeof neonAuthUser.$inferSelect;
export type NeonAuthSession = typeof neonAuthSession.$inferSelect;
export type NeonAuthAccount = typeof neonAuthAccount.$inferSelect;
export type NeonAuthVerification = typeof neonAuthVerification.$inferSelect;

// Organization types
export type NeonAuthOrganization = typeof neonAuthOrganization.$inferSelect;
export type NeonAuthMember = typeof neonAuthMember.$inferSelect;
export type NeonAuthInvitation = typeof neonAuthInvitation.$inferSelect;
