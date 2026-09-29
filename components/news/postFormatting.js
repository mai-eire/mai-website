// Small shared helpers for presenting a post. Kept out of the components so
// the hub cards, the detail pages and the RSS feed all format a date or build
// a URL the same way.

import { format, parseISO } from 'date-fns';
import { getPostType, getTopic } from '../../data/posts';

// Statements get quoted and cited, so dates are unambiguous and spelled out
// ("14 September 2026") rather than numeric, which reads differently in
// Ireland and the US.
export const formatPostDate = (iso) => {
  if (!iso) return '';
  try {
    return format(parseISO(iso), 'd MMMM yyyy');
  } catch {
    return '';
  }
};

// Machine-readable value for <time dateTime> and structured data.
export const toDateAttr = (iso) => (iso ? iso.slice(0, 10) : undefined);

export const postUrl = (post) => `${getPostType(post.type).basePath}/${post.slug}`;

// Where an editor looks at a post that is not live yet. It mirrors the public
// address under /admin so the two never drift: /statements/x is previewed at
// /admin/drafts/statements/x. Signed-in editors only - see the page's guard.
export const draftPreviewUrl = (post) =>
  `/admin/drafts${getPostType(post.type).basePath}/${post.slug}`;

export const absoluteUrl = (path) => {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://new.mai.ie').replace(/\/$/, '');
  return `${base}${path}`;
};

export const topicLabel = (id) => getTopic(id)?.label || id;

// Rough reading time for articles. Statements do not get one - a press release
// is read in full regardless of length, and the estimate reads as clutter.
export const readingMinutes = (body) => {
  const words = String(body || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
