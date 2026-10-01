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
//
// Outside Cloudflare - on Netlify - there is no binding, so the same database
// is reached over D1's HTTP API with an API token instead. Development never
// takes that path, even with the token sitting in .env.local: the local binding
// is attached asynchronously after `next dev` starts, and a request that lands
// before it would otherwise fall through and quietly write to production.

import { PrismaClient } from './generated/prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Cached per isolate, keyed on the binding itself. Reusing the client across
// requests in the same isolate avoids rebuilding it on every hit; keying on the
// binding means that if the runtime ever hands us a different one, we notice
// and rebuild rather than quietly querying the previous request's database.
// The HTTP client has no binding to key on, so it is keyed on a marker.
let cached: { db: unknown; client: PrismaClient } | undefined;

const HTTP = Symbol('d1-http');

// The D1 binding, or undefined when this is not running on Cloudflare.
// getCloudflareContext() throws rather than returning nothing when there is no
// context at all, which is the normal state of affairs on Netlify.
const binding = (): unknown => {
  try {
    return (getCloudflareContext().env as Record<string, unknown>).DB;
  } catch {
    return undefined;
  }
};

const getClient = (): PrismaClient => {
  const db = binding();

  if (db) {
    if (cached && cached.db === db) return cached.client;
    const client = new PrismaClient({ adapter: new PrismaD1(db as never) });
    cached = { db, client };
    return client;
  }

  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      'The local D1 binding "DB" is not attached. next.config.mjs calls ' +
        'initOpenNextCloudflareForDev() to set it up, which finishes shortly ' +
        'after `next dev` starts - retry the request.'
    );
  }

  const { CLOUDFLARE_D1_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID } = process.env;

  if (!CLOUDFLARE_D1_TOKEN || !CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_DATABASE_ID) {
    throw new Error(
      'No database. On Cloudflare, check the d1_databases block in ' +
        'wrangler.jsonc. Anywhere else (Netlify), set CLOUDFLARE_D1_TOKEN, ' +
        'CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_DATABASE_ID - see ' +
        'docs/cloudflare.md.'
    );
  }

  if (cached && cached.db === HTTP) return cached.client;

  const client = new PrismaClient({
    adapter: new PrismaD1({ CLOUDFLARE_D1_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID }),
  });
  cached = { db: HTTP, client };
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
