// npm install prisma tsx @types/pg --save-dev
// npm install @prisma/client @prisma/adapter-pg dotenv pg
// npx prisma migrate dev --name init
// npx prisma generate

import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/',
  migrations: {
    path: 'prisma/migrations',
    seed: `tsx prisma/seed.ts`,
  },
  datasource: {
    url: env('DATABASE_URL'),
    directUrl: env('DATABASE_DIRECT_URL'),
  },
});
