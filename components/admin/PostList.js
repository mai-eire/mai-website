import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import { POST_TYPES, getPostType } from '../../data/posts';
import { formatPostDate, postUrl } from '../news/postFormatting';

// Below this many posts a search box is clutter - you can see everything at
// once. Above it, scanning stops working and search starts earning its place.
const SEARCH_THRESHOLD = 8;

// One row. The whole row opens the editor, so there is no "Edit" link to aim
// at; the only separate control is the one that goes somewhere else entirely -
// the live page - and that only exists once a post is published.
const Row = ({ post, isLast }) => {
  const meta = getPostType(post.type);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: { xs: 2, sm: 2.5 },
        py: 2,
        borderBottom: isLast ? 'none' : '1px solid',
        borderColor: 'divider',
        transition: 'background-color 150ms ease',
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
        '&:focus-within': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: -2,
        },
      }}
    >
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, lineHeight: 1.35, mb: 0.25 }}
        >
          <Link
            href={`/admin/posts/${post.id}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {/* Stretches the link across the row without swallowing the
                other controls into the anchor. */}
            <Box
              component="span"
              sx={{ '&::after': { content: '""', position: 'absolute', inset: 0 } }}
            >
              {post.title}
            </Box>
          </Link>
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {meta.label}
          {post.publishedAt ? ` · ${formatPostDate(post.publishedAt)}` : ''}
          {post.topics?.length ? ` · ${post.topics.length} topic${post.topics.length === 1 ? '' : 's'}` : ''}
        </Typography>
      </Box>

      {post.status === 'PUBLISHED' && (
        <Tooltip title="Open the live page">
          <IconButton
            component={Link}
            href={postUrl(post)}
            target="_blank"
            size="small"
            aria-label={`Open the live page for ${post.title}`}
            // Lifted above the row-wide link overlay so this stays clickable.
            sx={{ position: 'relative', zIndex: 1, color: 'text.secondary' }}
          >
            <OpenInNewIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      )}

      <ChevronRightIcon sx={{ color: 'text.disabled', flexShrink: 0 }} />
    </Box>
  );
};

const Section = ({ label, count, posts, tone = 'default' }) => (
  <Box sx={{ mb: 4 }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
      <Typography
        sx={{
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: tone === 'draft' ? 'primary.main' : 'text.secondary',
        }}
      >
        {label}
      </Typography>
      <Chip
        size="small"
        label={count}
        sx={{
          height: 20,
          fontSize: '0.7rem',
          fontWeight: 700,
          backgroundColor: tone === 'draft' ? 'primary.main' : 'rgba(0, 0, 0, 0.06)',
          color: tone === 'draft' ? 'primary.contrastText' : 'text.secondary',
        }}
      />
    </Stack>

    <Box
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: tone === 'draft' ? 'rgba(46, 125, 50, 0.35)' : 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {posts.map((post, i) => (
        <Row key={post.id} post={post} isLast={i === posts.length - 1} />
      ))}
    </Box>
  </Box>
);

// The back-office list.
//
// Status is carried by the sections rather than by a column, which is what
// removes the row of identical "Published" pills the table used to show. Drafts
// come first because unfinished work is the thing you need to notice on
// arrival, and their section disappears entirely when there are none.
const PostList = ({ posts }) => {
  const [type, setType] = useState('ALL');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (type !== 'ALL' && p.type !== type) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.displaySummary || '').toLowerCase().includes(q)
      );
    });
  }, [posts, type, query]);

  const drafts = visible.filter((p) => p.status === 'DRAFT');
  const published = visible.filter((p) => p.status === 'PUBLISHED');

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        {/* One filter, one axis. Status is the sections' job. */}
        <Stack direction="row" spacing={1}>
          <Chip
            label="All"
            onClick={() => setType('ALL')}
            variant={type === 'ALL' ? 'filled' : 'outlined'}
            sx={{
              fontWeight: 600,
              borderRadius: 1.5,
              ...(type === 'ALL'
                ? { backgroundColor: 'primary.main', color: 'primary.contrastText' }
                : { color: 'text.secondary' }),
            }}
          />
          {POST_TYPES.map((t) => (
            <Chip
              key={t.id}
              label={t.pluralLabel}
              onClick={() => setType(t.id)}
              variant={type === t.id ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 600,
                borderRadius: 1.5,
                ...(type === t.id
                  ? { backgroundColor: 'primary.main', color: 'primary.contrastText' }
                  : { color: 'text.secondary' }),
              }}
            />
          ))}
        </Stack>

        {posts.length > SEARCH_THRESHOLD && (
          <TextField
            size="small"
            placeholder="Search titles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: { sm: 240 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        )}
      </Stack>

      {visible.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            {posts.length === 0 ? 'Nothing written yet' : 'Nothing matches'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {posts.length === 0
              ? 'Use “New post” to write the first statement or article.'
              : 'Try another filter or search term.'}
          </Typography>
        </Box>
      ) : (
        <>
          {drafts.length > 0 && (
            <Section label="Drafts" count={drafts.length} posts={drafts} tone="draft" />
          )}
          {published.length > 0 && (
            <Section label="Published" count={published.length} posts={published} />
          )}
        </>
      )}
    </Box>
  );
};

export default PostList;
