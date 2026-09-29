// Prisma 7 moved the connection out of schema.prisma. At runtime the Worker
// supplies it as the D1 binding (see lib/prisma.ts); this file is what the
// Prisma CLI reads instead, so that `prisma migrate diff` can compare the
// schema against the local D1 database Wrangler keeps under .wrangler/.
//
// Migrations are applied by Wrangler, not by `prisma migrate` - D1 only accepts
// them through its own migrations system. See docs/cloudflare.md.

import path from 'node:path';
import { defineConfig } from '@prisma/config';
import { listLocalDatabases } from '@prisma/adapter-d1';

const local = listLocalDatabases();

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('migrations'),
  },
  // Empty until `wrangler d1 migrations apply --local` has created the local
  // database; the CLI only needs this for commands that inspect it.
  datasource: local.length ? { url: `file:${local[local.length - 1]}` } : undefined,
});
