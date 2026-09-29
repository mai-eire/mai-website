// The Prisma client, bound to Cloudflare D1.
//
// This looks more indirect than the usual `export const prisma = new
// PrismaClient()` because on Workers it has to be. A connection-string client
// can be built once when the module is first imported; a D1 client cannot,
// because D1 arrives as a *binding* on the per-request environment rather than
// as a URL in `process.env`. There is nothing to connect to at import time.
//
// So the export below is a Proxy that builds the real client on first property
// access - which is the first query, which is always inside a request. Two
// things fall out of that, both wanted:
//
//   - Every call site keeps writing `prisma.post.findMany(...)`. Twenty-six of
//     them across eight files did not have to change.
//   - `next build` can still statically render the pages that never touch the
//     database. Were the client built at import time, merely importing this
//     module during the build would ask for a binding that does not exist yet
//     and fail the build.

import { PrismaClient } from './generated/prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Cached per isolate, keyed on the binding itself. Reusing the client across
// requests in the same isolate avoids rebuilding it on every hit; keying on the
// binding means that if the runtime ever hands us a different one, we notice
// and rebuild rather than quietly querying the previous request's database.
let cached: { db: unknown; client: PrismaClient } | undefined;

const getClient = (): PrismaClient => {
  const { env } = getCloudflareContext();
  const db = (env as Record<string, unknown>).DB;

  if (!db) {
    throw new Error(
      'The D1 binding "DB" is missing. Check the d1_databases block in ' +
        'wrangler.jsonc, and that next.config.js calls ' +
        'initOpenNextCloudflareForDev() so `next dev` gets a local one.'
    );
  }

  if (cached && cached.db === db) return cached.client;

  const client = new PrismaClient({ adapter: new PrismaD1(db as never) });
  cached = { db, client };
  return client;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getClient() as unknown as Record<string | symbol, unknown>;
    const value = client[property];
    // Model delegates (`prisma.post`) are objects whose own methods are already
    // bound to them, so they pass straight through. Top-level methods
    // (`prisma.$queryRaw`) are functions that would lose `this` when called off
    // the Proxy, so they are bound to the real client on the way out.
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
