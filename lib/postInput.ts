// Validation and normalisation for anything written to the Post table.
//
// The database columns are plain strings (SQLite has no enums), so this file is
// what actually keeps `type`, `status` and `topics` to known values. Both the
// create and the update route go through it - nothing writes a post directly.

import { POST_STATUS_IDS, POST_TYPE_IDS, TOPIC_IDS } from '../data/posts';
import { encodeTopics, uniqueSlug } from './posts';

export interface PostInputResult {
  errors: string[];
  data?: any;
}

const str = (v: any): string => (v === null || v === undefined ? '' : String(v).trim());
const orNull = (v: any): string | null => str(v) || null;

export const buildPostData = async (
  body: any,
  { existingId, existingStatus }: { existingId?: string; existingStatus?: string } = {}
): Promise<PostInputResult> => {
  const errors: string[] = [];

  const type = str(body.type).toUpperCase();
  if (!POST_TYPE_IDS.includes(type)) errors.push('Choose whether this is a statement or an article.');

  const status = str(body.status).toUpperCase() || 'DRAFT';
  if (!POST_STATUS_IDS.includes(status)) errors.push('Status must be Draft or Published.');

  const title = str(body.title);
  if (!title) errors.push('A title is required.');
  if (title.length > 200) errors.push('Title is too long (200 characters maximum).');

  // A summary is optional. Left blank it is stored blank, and every public
  // surface falls back to the opening of the body - see displaySummary in
  // lib/posts.ts. We deliberately do not store the fallback: a derived summary
  // written into the column would go stale the moment the body was edited.
  const summary = str(body.summary);
  if (summary.length > 320) errors.push('Summary is too long (320 characters maximum).');

  const bodyText = str(body.body);
  if (!bodyText) errors.push('The post has no body text.');

  const topics = Array.isArray(body.topics) ? body.topics : [];
  const unknown = topics.filter((t: string) => !TOPIC_IDS.includes(t));
  if (unknown.length) errors.push(`Unknown topic: ${unknown.join(', ')}`);

  if (errors.length) return { errors };

  // A slug is a permanent public address. It is derived from the title when
  // the post is first created and then left alone unless an editor explicitly
  // supplies one, so publishing an edit never breaks a link someone shared.
  const desiredSlug = str(body.slug) || title;
  const slug = await uniqueSlug(desiredSlug, existingId);

  // publishedAt is set once, the first time a post goes live, and is what the
  // public list orders by. Re-publishing after an edit must not jump the post
  // back to the top of the page as though it were new.
  let publishedAt: Date | null | undefined;
  if (status === 'PUBLISHED' && existingStatus !== 'PUBLISHED') {
    publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
  } else if (status === 'PUBLISHED' && body.publishedAt) {
    publishedAt = new Date(body.publishedAt); // editor deliberately backdated it
  } else if (status === 'DRAFT') {
    publishedAt = null; // unpublishing clears the date so it cannot resurface
  }

  if (publishedAt && Number.isNaN(publishedAt.getTime())) {
    return { errors: ['Publication date is not a valid date.'] };
  }

  const isStatement = type === 'STATEMENT';

  return {
    errors: [],
    data: {
      type,
      title,
      slug,
      summary,
      body: bodyText,
      status,
      ...(publishedAt !== undefined ? { publishedAt } : {}),
      topics: encodeTopics(topics),
      coverImageUrl: orNull(body.coverImageUrl),

      // Each type only ever writes its own fields; the other group is cleared.
      // Without this, switching a post's type would leave a stale byline
      // hanging off a statement.
      authorName: isStatement ? null : orNull(body.authorName),
      authorTitle: isStatement ? null : orNull(body.authorTitle),
      authorPhotoUrl: isStatement ? null : orNull(body.authorPhotoUrl),
      isExternalSubmission: isStatement ? false : Boolean(body.isExternalSubmission),

      issuedBy: isStatement ? orNull(body.issuedBy) : null,
      referenceCode: isStatement ? orNull(body.referenceCode) : null,
      pdfUrl: isStatement ? orNull(body.pdfUrl) : null,
    },
  };
};
