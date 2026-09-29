// The fallback preview for a post that has no summary of its own.
//
// A summary is optional in the editor. When it is blank, every surface that
// would have shown one - the newsroom cards, the <meta description>, the RSS
// item, the social card - shows the opening of the body instead. That is
// derived here, at read time rather than stored, so a post whose body is later
// rewritten never keeps a stale preview of its old opening.
//
// This file must stay free of any database import: the admin editor calls it in
// the browser to show an author what the fallback will say.

// Roughly two lines on a card, and comfortably inside the 155-160 characters a
// search result will show before it truncates.
const EXCERPT_LENGTH = 180;

export const excerptFromBody = (body: string | null | undefined): string => {
  const plain = String(body || '')
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    // A heading is a label for what follows, not prose, so it reads badly as
    // the opening of a preview. Drop them and take the first real paragraph.
    .replace(/^[ \t]{0,3}#{1,6}[ \t]+.*$/gm, ' ')
    .replace(/^[ \t]{0,3}>[ \t]?/gm, '') // quote markers
    .replace(/^[ \t]{0,3}[-*+][ \t]+/gm, '') // bullets
    .replace(/^[ \t]{0,3}\d+\.[ \t]+/gm, '') // numbered list markers
    .replace(/^[ \t]{0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/gm, ' ') // thematic breaks
    // A table reads as pipe soup once the line breaks are gone, and its cells
    // are data rather than prose. Drop the rows and take the surrounding text.
    .replace(/^[ \t]{0,3}\|.*$/gm, ' ')
    .replace(/<[^>]+>/g, ' ') // any raw HTML the body is allowed to carry
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images have nothing to contribute
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links keep their text, lose the URL
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= EXCERPT_LENGTH) return plain;

  // Cut on a word boundary so a preview never ends mid-word.
  const cut = plain.slice(0, EXCERPT_LENGTH);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim()}…`;
};

export default excerptFromBody;
