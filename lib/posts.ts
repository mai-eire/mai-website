// Data access for the newsroom (statements + articles).
//
// Everything the public pages read goes through here so two rules are enforced
// in exactly one place: only PUBLISHED posts are ever visible, and the `topics`
// column is only ever touched through the encode/decode helpers below.

import { prisma } from './prisma';
import { excerptFromBody } from './excerpt';
import { POSTS_PER_PAGE, POST_TYPE_IDS, TOPIC_IDS } from '../data/posts';

export type PostType = 'STATEMENT' | 'ARTICLE';
export type PostStatus = 'DRAFT' | 'PUBLISHED';

// A post as the React pages receive it: dates already strings, topics already
// an array. getServerSideProps cannot serialize Date objects, so the boundary
// is here rather than sprinkled through the components.
export interface SerializedPost {
  id: string;
  type: PostType;
  title: string;
  slug: string;
  // What the editor typed, which may be empty - the editor treats a summary as
  // optional. Nothing public should read this field directly.
  summary: string;
  // What to show: the summary if there is one, otherwise the opening of the
  // body. Every public surface uses this, so a post without a summary still has
  // a card, a meta description and an RSS item that read properly.
  displaySummary: string;
  body: string;
  status: PostStatus;
  publishedAt: string | null;
  topics: string[];
  coverImageUrl: string | null;
  authorName: string | null;
  authorTitle: string | null;
  authorPhotoUrl: string | null;
  isExternalSubmission: boolean;
  issuedBy: string | null;
  referenceCode: string | null;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- topics -----------------------------------------------------------------
// SQLite has no array type. Topics live in one column as comma-delimited ids,
// wrapped in leading/trailing commas (",a,b,") so a `contains ",a,"` filter
// matches a whole id and never a partial one - without the wrapping, topic
// "youth" would also match a hypothetical "youth-sports".

export const encodeTopics = (topics: string[] | undefined | null): string => {
  const clean = (topics || [])
    .map((t) => String(t).trim())
    .filter((t) => TOPIC_IDS.includes(t));
  const unique = Array.from(new Set(clean));
  return unique.length ? `,${unique.join(',')},` : '';
};

export const decodeTopics = (raw: string | null | undefined): string[] =>
  (raw || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

const topicFilter = (topic: string) => ({ topics: { contains: `,${topic},` } });

// --- serialization ----------------------------------------------------------

export const serializePost = (post: any): SerializedPost => ({
  ...post,
  displaySummary: post.summary || excerptFromBody(post.body),
  topics: decodeTopics(post.topics),
  publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
  createdAt: post.createdAt.toISOString(),
  updatedAt: post.updatedAt.toISOString(),
});

// --- slugs ------------------------------------------------------------------

export const slugify = (input: string): string =>
  String(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

// Slugs are permanent public URLs, so a collision must never overwrite an
// existing post's address - we suffix instead.
export const uniqueSlug = async (
  desired: string,
  excludePostId?: string
): Promise<string> => {
  const base = slugify(desired) || 'post';
  let candidate = base;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const clash = await prisma.post.findUnique({ where: { slug: candidate } });
    if (!clash || clash.id === excludePostId) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
};

// --- public queries ---------------------------------------------------------

interface ListOptions {
  type?: PostType | null;
  topic?: string | null;
  page?: number;
  perPage?: number;
}

export interface PostListResult {
  posts: SerializedPost[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

export const listPublishedPosts = async ({
  type = null,
  topic = null,
  page = 1,
  perPage = POSTS_PER_PAGE,
}: ListOptions = {}): Promise<PostListResult> => {
  const where: any = { status: 'PUBLISHED' };
  if (type && POST_TYPE_IDS.includes(type)) where.type = type;
  if (topic && TOPIC_IDS.includes(topic)) Object.assign(where, topicFilter(topic));

  const safePage = Math.max(1, Math.floor(page) || 1);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      // Newest first. publishedAt can tie (bulk publish), so createdAt breaks it
      // to keep ordering stable across requests and pagination pages.
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      skip: (safePage - 1) * perPage,
      take: perPage,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts: posts.map(serializePost),
    total,
    page: safePage,
    perPage,
    hasMore: safePage * perPage < total,
  };
};

export const getPublishedPost = async (
  type: PostType,
  slug: string
): Promise<SerializedPost | null> => {
  const post = await prisma.post.findUnique({ where: { slug } });
  // Guard the type too: /articles/<a-statement-slug> must 404 rather than
  // render a statement inside the opinion-piece template.
  if (!post || post.status !== 'PUBLISHED' || post.type !== type) return null;
  return serializePost(post);
};

// Shown at the foot of a post. Prefers same-type, same-topic company.
export const getRelatedPosts = async (
  post: SerializedPost,
  limit = 3
): Promise<SerializedPost[]> => {
  const base: any = { status: 'PUBLISHED', id: { not: post.id } };
  const byTopic = post.topics.length
    ? await prisma.post.findMany({
        where: { ...base, OR: post.topics.map((t) => topicFilter(t)) },
        orderBy: [{ publishedAt: 'desc' }],
        take: limit,
      })
    : [];

  if (byTopic.length >= limit) return byTopic.map(serializePost);

  // Top up with the latest of the same type so the rail is never half-empty.
  const fill = await prisma.post.findMany({
    where: {
      ...base,
      type: post.type,
      id: { notIn: [post.id, ...byTopic.map((p) => p.id)] },
    },
    orderBy: [{ publishedAt: 'desc' }],
    take: limit - byTopic.length,
  });

  return [...byTopic, ...fill].map(serializePost);
};

export interface TopicOption {
  id: string;
  // False when no published post of the currently selected type carries this
  // topic. The chip is still shown, so the filter row keeps the same shape as
  // you switch between All / Statements / Articles, but it is disabled rather
  // than offering a click that leads to an empty list.
  enabled: boolean;
}

// The topic filter row: every topic that is in use anywhere in the newsroom,
// each marked according to whether it returns anything under `type`.
export const getTopicOptions = async (
  type?: PostType | null
): Promise<TopicOption[]> => {
  const rows = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { topics: true, type: true },
  });

  const usedAnywhere = new Set<string>();
  const usedInType = new Set<string>();
  const narrowing = Boolean(type && POST_TYPE_IDS.includes(type));

  rows.forEach((row) => {
    decodeTopics(row.topics).forEach((t) => {
      usedAnywhere.add(t);
      if (!narrowing || row.type === type) usedInType.add(t);
    });
  });

  return TOPIC_IDS.filter((t) => usedAnywhere.has(t)).map((id) => ({
    id,
    enabled: usedInType.has(id),
  }));
};

// --- admin queries ----------------------------------------------------------
// These deliberately ignore `status` - the back office must see drafts.

export const listAllPosts = async ({
  type = null,
  status = null,
}: { type?: PostType | null; status?: PostStatus | null } = {}) => {
  const where: any = {};
  if (type && POST_TYPE_IDS.includes(type)) where.type = type;
  if (status) where.status = status;
  const posts = await prisma.post.findMany({
    where,
    orderBy: [{ updatedAt: 'desc' }],
  });
  return posts.map(serializePost);
};

// Preview: the same lookup as the public one but without the status guard, so
// an editor can see a draft rendered as its published page would be. The type
// is still checked, so a preview URL cannot render a statement as an article.
// Every caller of this must be behind an auth guard.
export const getAnyPostBySlug = async (
  type: PostType,
  slug: string
): Promise<SerializedPost | null> => {
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || post.type !== type) return null;
  return serializePost(post);
};

export const getPostById = async (id: string): Promise<SerializedPost | null> => {
  const post = await prisma.post.findUnique({ where: { id } });
  return post ? serializePost(post) : null;
};
