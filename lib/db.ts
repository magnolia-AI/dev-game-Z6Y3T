'server-only';
/*
This file is used to connect to the database.
Changing it may break behavior of the vy.dev.
Only change it if you know what you are doing and dont rely on vy.dev to deploy.
You can only use the database server side
*/

import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import { env } from './env';

// Configure Neon
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

// Type definitions
declare global {
  var db: ReturnType<typeof drizzle> | undefined;
}

const pool = new Pool({ connectionString: env.DATABASE_URL });

// Create Drizzle instance
const db = global.db || drizzle(pool);

if (env.NODE_ENV === 'development') {
  global.db = db;
}

export default db; 