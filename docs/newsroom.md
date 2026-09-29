# The Newsroom: statements and articles

How publishing works on the MAI site, and what has to happen before it works in
production.

## The two kinds of post

| | Statement | Article |
| --- | --- | --- |
| What it is | An official MAI position, response or announcement | An opinion piece by a member or a guest contributor |
| Speaks for | The organisation | One person |
| Lives at | `/statements/<slug>` | `/articles/<slug>` |
| Listed on | `/news?type=STATEMENT` | `/news?type=ARTICLE` |
| Carries | Issuing body, reference code, optional PDF, press contact | Byline, author photo, cover image, reading time |
| Disclaimer | None - it *is* the MAI position | Shown when "Outside submission" is ticked |

Both are rows in the same `Post` table, separated by a `type` column. They share
a table because they share nearly every field and because one newsroom page
lists them together; they have separate URL prefixes and separate templates
because a journalist linking `mai.ie/statements/...` should see something that
reads as official, not as a blog post.

## The pages

There is **one** listing page.

- **`/news`** - the Newsroom. Everything, newest first, one post per row.
  `?type=STATEMENT` or `?type=ARTICLE` narrows it, and `?topic=<id>` filters by
  subject. The heading, the intro and the social preview all follow the filter,
  so `/news?type=STATEMENT` still arrives looking like a page about statements.
- **`/statements/<slug>`**, **`/articles/<slug>`** - the posts themselves. The
  prefixes are kept deliberately: a journalist linking `mai.ie/statements/...`
  should see an address that reads as official.
- **`/news/rss.xml`** - the whole newsroom as a feed, for aggregators.
- `/statements` and `/articles` were listing pages in an earlier revision.
  They now redirect to the matching filter (see `next.config.js`), so any link
  already handed out still works.

Filters live in the URL, so any filtered view can be bookmarked, sent to a
journalist or linked from a newsletter, and the back button behaves as expected.

## How the list looks, and why

One post per card, spaced apart down a single column.

- **Media sits beside the text on a wide screen and on top of it on a narrow
  one.** Below the `sm` breakpoint the image goes full-bleed across the top of
  the card instead: a ~100px thumbnail on a phone earns none of the space it
  costs. A real photograph gets a 16:9 banner there; a generated tile is
  decoration, so it takes a shallower 3:1 band rather than pushing every
  headline further down the scroll.

- **Statements get a green rail and a faintly tinted row**; articles sit on
  plain white. Scrolling the list tells you which items are official MAI
  positions before you read a word. The two carry different weight and the list
  says so.
- **Neither type needs a photograph.** A statement never has one - a press
  statement that needs a stock image is one nobody trusts - and an article
  sometimes arrives without one. Both fall back to a designed tile
  (`components/news/PostTile.js`): solid brand green marked STATEMENT with the
  reference code, or quiet paper-grey marked ARTICLE. An empty grey box would
  read as a broken image, which is why there isn't one.
- **Topic chips that have nothing under the current tab are disabled, not
  hidden.** The row keeps the same shape as you switch tabs, and no chip leads
  to an empty list.

## Publishing

1. Sign in at `/admin/login`.
2. `/admin` is the hub; `/admin/posts` lists everything, drafts included.
3. "New post" opens the editor: write the title and the body on the left, and
   set what the post *is* - type, topics, byline or issuing details - in the
   column on the right.
4. **Save draft** keeps it private. **Publish** makes it live immediately -
   pages are server-rendered, so there is no rebuild and no wait.

A **summary is optional**. Left blank, every public surface - the newsroom card,
the `<meta description>`, the social card, the RSS item - falls back to the
opening of the body. The editor shows that fallback as the greyed text inside
the summary field, so what you see there is literally what a reader will get.
The fallback is derived on read (`lib/excerpt.ts`, surfaced as `displaySummary`
in `lib/posts.ts`) and never written to the database: a derived summary stored
in the column would go stale the moment the body was rewritten. Nothing public
should read `post.summary` directly - use `post.displaySummary`.

### How the back office is laid out

The admin does **not** render the public navbar or footer (`_app.tsx` skips them
for `/admin/*`). It is a tool, not a page of the website, so it gets its own
slim bar from `components/admin/AdminShell.js` carrying the things that belong
to the session rather than the page: who you are, the way out, a link to the
live site.

In the post list, **status is carried by the sections, not by a column** -
drafts first, published below - which is what removes the column of identical
"Published" pills the old table showed. The one filter left is type, because
that is the only other axis; the two used to be mixed into a single control
where "Statements" and "Drafts" looked like alternatives, which they are not.
Whole rows are clickable, so there is no "Edit" link to aim at; the only
separate control is the one that leaves the admin entirely - the live page -
and it only appears once a post is published.

In the editor, the left column is the writing and nothing else - title, summary,
body, in the order they are read. The right column is everything that describes
the post rather than being it, starting with the type, because the type decides
what the rest of that column even asks for. Below it, each set of details is its
own foldaway section - **Author details** and **Cover image** for an article,
**Statement details** for a statement - so nothing sits open in front of an
editor who has no use for it.

Every one of those sections **starts shut**, and each carries a hint beside its
label - the author's name, the topics that are on, whether there is a cover
image - so a closed section still tells you the state of the post. Topics are a
checklist: a tick beside every option, on or off, with the chosen ones listed as
pills *below* the input rather than piling up inside it.

The actions sit in a **sticky bar** that follows you down a long body instead of
in a sidebar card. The two fields that can break existing links - the slug and
the publication date - are behind an **Advanced** disclosure, because they are
both rarely needed and the most damaging to get wrong. Delete lives in the
overflow menu and is disabled while a post is live.

### Previewing before you publish

**Preview** on a draft shows the post exactly as its published page will look,
at `/admin/drafts/statements/<slug>` or `/admin/drafts/articles/<slug>` - the
public address with `/admin/drafts` in front of it, so the two can never drift.

- It is **signed-in editors only**. Without a session it redirects to the login
  page, and it is `noindex, nofollow` with no canonical URL and no social card,
  so a preview link that escapes gives nothing away. `Cache-Control: no-store`:
  a draft behind a shared cache is a published draft.
- `_app.tsx` makes a deliberate exception for `/admin/drafts` and keeps the
  **public navbar and footer**. A preview missing the site's own chrome is not
  showing you the page you are about to publish.
- The bar across the top is sticky and sits above the site header, so the
  warning cannot be scrolled away. It carries **Back to editing** and
  **Publish**, and publishing from there sends the post back exactly as it
  stands - it is not a second way to edit it.
- **Preview saves the draft first.** Showing an editor the last saved version of
  a post they have been typing into would be worse than offering no preview. It
  is only offered while a post is a draft; saving a live post as a draft would
  take it off the site, so a live post gets **View** instead.
- A draft has no publication date, which is why both templates print "Not
  published yet" rather than an empty `<time>`.

### The body editor

`components/admin/RichTextEditor.js` is a what-you-see editor (Tiptap) that
**stores Markdown**. The column, the feed and the public page are unchanged;
this is only a different way of typing the same thing, for editors who have
never written Markdown. Markdown shortcuts still work as you type, so anyone who
has can keep going.

Two things in there are load-bearing:

- **The table extensions are loaded even though the toolbar cannot insert a
  table.** Without them, opening a post that already contains one would drop it
  on the next save. A round trip through the editor was checked against a body
  containing a table, headings, both kinds of list, a quote, bold text and a
  link, and came back byte-identical.
- **`onChange` fires only on a real document change.** Opening a post and
  closing it again never rewrites its stored Markdown, so existing posts are not
  quietly reformatted by being looked at.

The toolbar is sticky, and the box around it deliberately has no
`overflow: hidden`: that would make the box the toolbar's scrollport, and a
sticky element inside a box that never scrolls gets pushed down by its own `top`
offset - it landed 126px into the first paragraph. The corners are rounded on
the toolbar and the footer individually instead.

Things worth knowing:

- **A draft is genuinely invisible.** Its URL returns 404, and it never appears
  in the public API or the RSS feed.
- **`publishedAt` is set once**, the first time a post goes live. Editing a live
  post later does not bump it back to the top of the list. Change the date only
  to correct the record.
- **The slug is a permanent address.** It is derived from the title on creation
  and never changes on its own. If two posts would collide, the second gets a
  numeric suffix rather than stealing the first one's URL. Changing a slug by
  hand breaks every link anyone has already shared.
- **A published post cannot be deleted** until it is unpublished first. Deleting
  a statement breaks the public record and every citation of it.
- **Switching a post's type clears the other type's fields**, so a statement
  never keeps a stale byline.

## Accounts

```bash
npm run create-admin -- someone@mai.ie "Their Name" EDITOR
```

The password is prompted for, not passed as an argument, so it stays out of
shell history. `EDITOR` can write and publish; `ADMIN` is the same today and
exists for future account management.

Sessions are a signed, httpOnly cookie (`jose`) over a bcrypt password hash.
`AUTH_SECRET` signs them - if it is missing or under 32 characters the app
refuses to sign anyone in rather than falling back to a guessable key.

## The database

Currently **SQLite**, at `prisma/dev.db`, for local development:

```bash
npm run db:push          # create/update the local database from the schema
npm run seed:newsroom    # four example posts, so the pages have content
```

The schema is deliberately written to work on both SQLite and PostgreSQL, so
moving is a one-line provider change plus a fresh migration:

- **No enums.** SQLite has none. `type`, `status` and `role` are plain strings,
  and the allowed values live in `data/posts.js` and `data/users.js`, which
  `lib/postInput.ts` validates against on every write.
- **No arrays.** `topics` is one comma-delimited column, wrapped in commas
  (`,palestine,youth,`) so a `contains ",youth,"` filter matches a whole tag and
  never a partial one. Always go through `encodeTopics` / `decodeTopics` in
  `lib/posts.ts`.
- **No `@db.Text`.** Plain `String`, which Prisma already maps to `text` on
  PostgreSQL.

If you land on Cloudflare D1, that is SQLite too and this schema fits as-is.

### Before this goes to production

**SQLite will not work on Netlify.** Serverless functions get an ephemeral,
read-only filesystem, so every function instance would see a different empty
database and nothing would persist. Production needs a real Postgres (or D1):

1. Change `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`.
2. Set `DATABASE_URL` in the Netlify environment to the Postgres connection
   string. The old Supabase URL is preserved, commented out, in `.env`.
3. Set `AUTH_SECRET` in the Netlify environment to a **different** value from
   the local one (`openssl rand -base64 32`).
4. Run `npx prisma migrate deploy` (or `db push`) against that database, then
   `npm run create-admin` once to make the first real account.
5. Set `NEXT_PUBLIC_SITE_URL` to the live origin so canonical URLs, RSS links
   and social-share cards point at the right domain.

One caution on Supabase specifically: the previous `DATABASE_URL` used the
direct connection on port 5432, which is a common cause of connection failures
from serverless platforms. If you go back to Supabase, use the pooler
connection string rather than the direct one.

## Code map

| Path | What it does |
| --- | --- |
| `data/posts.js` | Types, statuses, topics - the single source of truth |
| `lib/posts.ts` | All queries; the only place that decides what is public |
| `lib/postInput.ts` | Validation and normalisation for every write |
| `lib/excerpt.ts` | The fallback preview for a post with no summary |
| `lib/auth.ts` | Password hashing, session cookies, route guards |
| `components/news/` | Public pages: rows, tiles, filters, both detail templates |
| `components/admin/` | Back office: login, shell, list, editor, rich text |
| `pages/api/posts` | Public read-only feed (backs "Load more") |
| `pages/api/admin/posts` | Authenticated create / update / delete |
| `pages/admin/drafts/` | Signed-in preview of a post as its published page |

## A note on `_app.tsx`

The site-wide `<meta>` tags in `pages/_app.tsx` carry `key` props. Next only
lets a page override a tag from `_app` when both carry the **same key** - without
them, every statement shared on social media would show the generic site card
instead of its own headline. `components/news/PostSeo.js` relies on this. Do not
strip those keys.
