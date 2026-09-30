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

**The Workers Paid plan is required.** The Free plan caps CPU at 10ms per
invocation, and this app does not fit in 10ms - not for sign-in and not for
rendering either. Measured on the deployed Worker with `wrangler tail`, which
reports CPU separately from wall clock:

| Route | CPU | Outcome on Free |
| --- | --- | --- |
| `GET /about` | 9ms | scraped through |
| `GET /contact` | 8-10ms | killed on the slower runs |
| `GET /api/events` | 11ms | killed |
| `GET /news/rss.xml` | 10ms | killed |
| `GET /admin/login` | 10ms | killed |
| `POST /api/auth/login` | 10ms (of ~330ms needed) | killed every time |

Do not try to measure this with a stopwatch on the outside. Wall clock includes
the D1 round trip and network, and a request that is killed at the CPU limit can
still answer 200, so curl timings suggested everything was fine while a third of
the invocations were being destroyed. `wrangler tail` reports `"outcome":
"exceededCpu"` and is the only thing worth believing here.

Sign-in is the part that can never be made to fit. bcrypt at cost 12 is ~330ms
of pure CPU, 33x the cap, and that cost is the security property rather than
inefficiency - tuning it down to fit would mean a password hash weak enough to
be worth attacking. Rendering is closer to the line but still over it.

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
```

`NEXT_PUBLIC_SITE_URL` is **not** a secret and cannot be one. Next inlines every
`NEXT_PUBLIC_*` value into the bundle at build time, so a Worker secret of that
name is simply ignored. It defaults to `https://new.mai.ie` in
`components/news/postFormatting.js`; to ship a different origin, set it in the
environment that runs `npm run deploy`.

`AUTH_SECRET` **must differ from the local one** and must be at least 32
characters; `lib/auth.ts` refuses to sign anyone in rather than fall back to a
guessable key. The site URL is what canonical URLs, the RSS feed and social
cards are built from - if it is wrong, every shared link is wrong. Leave
`CONTACT_OVERRIDE_EMAIL` unset in production, or every department's mail goes to
one inbox.

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

- **There is nowhere to upload a file.** `coverImageUrl`, `authorPhotoUrl` and
  `pdfUrl` are text fields an editor pastes a URL into. R2 is the natural fit -
  it binds directly to the Worker - plus an authenticated upload route. Until
  then the "optional PDF on letterhead" a statement is supposed to carry has no
  way to exist.

## Continuous deployment

Every push to `main` on `github.com/mai-eire/mai-website` builds and deploys,
through **Cloudflare Workers Builds** - Cloudflare pulls from GitHub itself, so
there is no API token stored in the repository or in GitHub. The settings live
in the dashboard, under Workers & Pages -> mai-website -> Settings -> Builds:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Root directory | `/` |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx wrangler deploy` |

`npm ci` runs first, and `postinstall` runs `prisma generate` with it, which is
what recreates `lib/generated` - that directory is gitignored, so a build that
skipped it would fail on the first import. `.nvmrc` pins Node to the version
that was tested; without it the builder picks its own and the two drift.

**Migrations are deliberately not part of this.** D1 has no transactions and
`prisma migrate diff` will write a `DROP TABLE` if the schema implies one, so a
migration applied unattended can destroy production with nothing to roll back
to. Apply the schema change first, confirm it, then push:

```bash
npm run db:migrate:remote   # you, watching it
git push                    # then CI deploys the code
```

That ordering also means a deploy never lands on a database it does not match.

### A trap worth remembering

`prisma.config.ts` calls `listLocalDatabases()`, and that throws `ENOENT`
instead of returning `[]` when `.wrangler/` does not exist - which is true of
every fresh clone and every CI build. Because it runs from `postinstall`, it
took down `npm ci` before a build could start, and nothing about the error
mentioned CI. It is caught now. The general lesson: anything reading
`.wrangler/` or `lib/generated` is reading something that is not in the
repository, so test it against a clean clone rather than your working copy.

## Leaving Netlify

`netlify.toml` is still in the repository and the Netlify site still builds. It
is kept deliberately until a Cloudflare deploy has been confirmed against the
real domain. Once DNS points at the Worker, delete `netlify.toml`, remove
`@netlify/plugin-nextjs` from the Netlify UI, and drop the build hook.
