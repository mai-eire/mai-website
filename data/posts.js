// Single source of truth for the newsroom: what kinds of posts exist, what
// topics they can be tagged with, and how each kind presents itself.
// Shared by the public pages, the admin editor and the API routes. Because the
// database stores `type`, `status` and `topics` as plain strings (SQLite has no
// enums), THIS file is what makes a value valid - the API validates against it.
//
// `id`     is what is written to the database and used in ?type= / ?topic=
//          links. Keep it stable; changing one orphans existing posts.
// `label`  is display text only, safe to reword.

// How we refer to ourselves.
//
// The organisation is called MAI. That is the name on the page, everywhere a
// human reads it. "Muslim Association of Ireland" is kept ONLY on SEO surfaces
// - <meta> tags, JSON-LD structured data, the RSS channel description - where
// it helps people find us in a search but is never shown as our name.
//
// If you are writing a string a visitor will read, use ORG_NAME. Reach for
// ORG_SEO_NAME only inside a meta tag or structured data.
export const ORG_NAME = 'MAI';
export const ORG_SEO_NAME = 'Muslim Association of Ireland';

export const POST_TYPES = [
  {
    id: 'STATEMENT',
    label: 'Statement',
    pluralLabel: 'Statements',
    // The /statements and /articles pages are the same list pre-filtered, and
    // a post's own page lives under this prefix. Separate prefixes matter:
    // a journalist linking mai.ie/statements/... reads as official.
    basePath: '/statements',
    // blurb is shown on the page; metaDescription goes in <meta> and the
    // social card, so it carries the searchable long name. See ORG_NAME above.
    blurb:
      'Official statements from MAI: our position, our response, and the record of where we stand.',
    metaDescription:
      'Official statements from the Muslim Association of Ireland (MAI): our position, our response, and the record of where we stand.',
    // Statements speak for the organisation, so they carry an issuing body
    // rather than a personal byline.
    defaultIssuedBy: 'MAI Executive Committee',
  },
  {
    id: 'ARTICLE',
    label: 'Article',
    pluralLabel: 'Articles',
    basePath: '/articles',
    blurb:
      'Opinion, reflection and analysis from members of our community and from guest contributors.',
    metaDescription:
      'Opinion, reflection and analysis from the Muslim Association of Ireland (MAI) community and guest contributors.',
    defaultIssuedBy: null,
  },
];

export const POST_TYPE_IDS = POST_TYPES.map((t) => t.id);

export const getPostType = (id) =>
  POST_TYPES.find((t) => t.id === id) || POST_TYPES[0];

// Draft posts are invisible to the public; only PUBLISHED ones are ever
// returned by the public queries in lib/posts.ts.
export const POST_STATUSES = [
  { id: 'DRAFT', label: 'Draft' },
  { id: 'PUBLISHED', label: 'Published' },
];

export const POST_STATUS_IDS = POST_STATUSES.map((s) => s.id);

// Topic tags offered in the editor and used by the filter row on /news.
// Add freely - an id that no post uses simply never appears as a filter.
export const TOPICS = [
  { id: 'community', label: 'Community' },
  { id: 'islamophobia', label: 'Islamophobia' },
  { id: 'palestine', label: 'Palestine' },
  { id: 'education', label: 'Education' },
  { id: 'youth', label: 'Youth' },
  { id: 'interfaith', label: 'Interfaith' },
  { id: 'government-policy', label: 'Government & Policy' },
  { id: 'ramadan-eid', label: 'Ramadan & Eid' },
  { id: 'mosque-news', label: 'Mosque News' },
];

export const TOPIC_IDS = TOPICS.map((t) => t.id);

export const getTopic = (id) => TOPICS.find((t) => t.id === id) || null;

// The department that handles press enquiries and article submissions.
// Matches an `id` in data/departments.js so the newsroom can link straight to
// that department's contact form instead of hardcoding an address.
export const PRESS_DEPARTMENT_ID = 'media';

// How many posts a listing page shows before "Load more".
export const POSTS_PER_PAGE = 12;
