/*
This file is used to connect to the database.
Changing it may break behavior of the vy.dev.
Only change it if you know what you are doing and dont rely on vy.dev to deploy.
*/


import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  // Only include YOUR schema - not neon-auth-schema.ts
  // The neon_auth tables are managed by Neon Auth, not Drizzle
  schema: './lib/schema.ts',
  out: './lib/drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
}); 