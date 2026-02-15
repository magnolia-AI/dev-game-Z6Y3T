import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Environment variable validation using @t3-oss/env-nextjs
 * 
 * This ensures all required environment variables are present and valid
 * at build time, preventing runtime errors from missing configuration.
 * 
 * Usage:
 *   import { env } from '@/lib/env';
 *   const url = env.DATABASE_URL;
 */
export const env = createEnv({
  /**
   * Server-side environment variables (not exposed to the browser)
   */
  server: {
    DATABASE_URL: z.string().url().startsWith("postgres"),
    NEON_AUTH_BASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },

  /**
   * Client-side environment variables (exposed to the browser)
   * Must be prefixed with NEXT_PUBLIC_
   */
  client: {
    // Required in production for SEO (sitemap, robots.txt)
    NEXT_PUBLIC_APP_URL: process.env.NODE_ENV === 'production'
      ? z.string().url()
      : z.string().url().optional(),
  },

  /**
   * Map environment variables to the schema
   * Destructure all variables from process.env
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEON_AUTH_BASE_URL: process.env.NEON_AUTH_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /**
   * Skip validation in certain environments
   * Useful for Docker builds where env vars aren't available
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Allow empty strings for optional variables
   */
  emptyStringAsUndefined: true,
});
