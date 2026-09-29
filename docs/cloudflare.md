# Hosting on Cloudflare Workers

How the site is built and deployed, and the steps that need a Cloudflare
account. For how publishing itself works, see [newsroom.md](newsroom.md).

## What runs where

The site is a Next.js Pages Router app rendered on demand: every newsroom page
and every admin page is `getServerSideProps`, because publishing has to take
effect immediately rather than on the next rebuild. That needs a server, and on
Cloudflare that server is a Worker.

| Piece | What it is |
| --- | --- |
| The app | A Worker, built from Next by `@opennextjs/cloudflare` |
| The database | Cloudflare D1, bound to the Worker as `DB` |
| Static assets | Served from `.open-next/assets` by the `ASSETS` binding |
| Secrets | Wrangler secrets in production, `.dev.vars` locally |

**The Workers Paid plan is required.** Not a preference - the Free plan caps CPU
at 10ms per request, and a single sign-in spends roughly 300ms hashing the
password. Server-rendering a page exceeds 10ms on its own. Paid allows 30s.

## First-time setup

These are the steps that need your Cloudflare account. Everything else is
already in the repository.

```bash
npx wrangler login
```

**1. Create the database.**

```bash
npx wrangler d1 create mai-website
```

It prints a `database_id`. Put it in `wrangler.jsonc`, replacing
`"REPLACE_ME"` - that placeholder is the only thing in the repo that is not
ready to deploy.

**2. Create the schema.**

```bash
npm run db:migrate:remote
```

**3. Set the secrets.** These are not in `wrangler.jsonc` and must never be -
it is committed.

```bash
npx wrangler secret put AUTH_SECRET          # openssl rand -base64 32
npx wrangler secret put BREVO_API_KEY
npx wrangler secret put BREVO_LIST_ID
npx wrangler secret put CONTACT_FROM_EMAIL
npx wrangler secret put CONTACT_FROM_NAME
npx wrangler secret put CONTACT_TO_EMAIL
npx wrangler secret put NEXT_PUBLIC_SITE_URL # the live origin, no trailing slash
```

`AUTH_SECRET` **must differ from the local one** and must be at least 32
characters; `lib/auth.ts` refuses to sign anyone in rather than fall back to a
guessable key. `NEXT_PUBLIC_SITE_URL` is what canonical URLs, the RSS feed and
social cards are built from - if it is wrong, every shared link is wrong.
Leave `CONTACT_OVERRIDE_EMAIL` unset in production, or every department's mail
goes to one inbox.

**4. Deploy.**

```bash
npm run deploy
```

**5. Make the first account.**

```bash
npm run create-admin -- someone@mai.ie "Their Name" ADMIN --remote
```

Without `--remote` this writes to your local database, which is the safe
default but not what you want here.

## Day to day

```bash
npm run dev          # Next dev server, with a local D1 attached
npm run seed:newsroom # four example posts, local only
npm run preview      # build the Worker and run it locally - the real runtime
npm run deploy       # build and ship
```

`npm run dev` is the fast loop and is right for almost everything. Use
`npm run preview` before deploying anything that touches the database, bundling
or a dependency: it runs the actual Worker against actual D1, and a few things
only fail there (see **Things that only break on Workers** below).

### Changing the schema

D1 migrations are applied by Wrangler, not by `prisma migrate` - Prisma only
generates the SQL.

```bash
npx wrangler d1 migrations create mai-website describe-the-change
npm run db:diff >> migrations/<the file it just made>
npm run db:migrate            # apply locally, check it
npm run db:migrate:remote     # then production
```

Read the generated SQL before applying it. `migrate diff` will happily write a
`DROP TABLE` if that is what the schema change implies.

## Things that only break on Workers

Four problems cost real time during the move. All four are fixed, and all
four are commented where they live, but they share a shape worth recognising:
**the Node build and the Workers build resolve modules differently**, so a
dependency can be present, correct, and still missing from the bundle.

- **Prisma's query compiler is WebAssembly**, and Workers forbids building a
  wasm module from bytes at runtime (`Wasm code generation disallowed by
  embedder`). Only the `prisma-client` generator targeting `workerd` emits a
  static wasm import instead - see the generator block in `schema.prisma`.
- **The same client cannot serve both `next dev` and the Worker.** Development
  runs the app in Node and only borrows the Cloudflare bindings, and Node cannot
  import a `.wasm` file at all. So `schema.prisma` declares the client twice,
  once for `workerd` and once for `nodejs`, and `next.config.mjs` swaps them
  over in development. `lib/prisma.ts` has one import either way. If a query
  works under `npm run dev` and fails under `npm run preview`, this is the first
  place to look - they are genuinely different builds.
- **Webpack cannot parse that import's `?module` suffix**, so `next.config.mjs`
  marks it external for the Cloudflare bundler to resolve. It resolves it to an
  absolute path first: left relative, webpack re-resolves it against each
  emitted server chunk's directory and every lookup misses.
- **Emotion, via MUI, ships separate `edge-light` builds.** Next's build trace
  resolves with the Node condition and never copies them; the Workers bundler
  resolves with `workerd` and then cannot find them. `outputFileTracingIncludes`
  in `next.config.mjs` forces the whole `@emotion` scope into the trace.

`ERROR Failed to copy ...` lines during the build are noise - a second copy pass
hitting files that are already there. The packages are in the output; check
before chasing one.

## The database, honestly

D1 has **no transactions**. Prisma does not error on this; it runs the
statements of an implicit transaction individually, so a half-applied write is
possible in principle rather than reported.

Today that is safe, because no model in `schema.prisma` has a relation, so there
are no nested writes and nothing in the app calls `$transaction`. It stops being
safe the moment someone adds a relation, which is why that constraint is now
written into the schema's header comment rather than left as folklore.

## Still to do

Neither of these blocks the deploy, but both were found during the move and
neither is fixed:

- **`/api/events` has no authentication.** `POST`, `PUT` and `DELETE` are open
  to anyone, and the admin UI writes through them. On a public URL that means
  anyone can create or delete events. The posts API is behind `withAuth`;
  events never got the same treatment. This is a release blocker.
- **There is nowhere to upload a file.** `coverImageUrl`, `authorPhotoUrl` and
  `pdfUrl` are text fields an editor pastes a URL into. R2 is the natural fit -
  it binds directly to the Worker - plus an authenticated upload route. Until
  then the "optional PDF on letterhead" a statement is supposed to carry has no
  way to exist.

## Leaving Netlify

`netlify.toml` is still in the repository and the Netlify site still builds. It
is kept deliberately until a Cloudflare deploy has been confirmed against the
real domain. Once DNS points at the Worker, delete `netlify.toml`, remove
`@netlify/plugin-nextjs` from the Netlify UI, and drop the build hook.
