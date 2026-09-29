import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Typography, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PostTile from './PostTile';
import { ORG_NAME } from '../../data/posts';
import {
  formatPostDate,
  postUrl,
  readingMinutes,
  toDateAttr,
  topicLabel,
} from './postFormatting';

// One card in the newsroom list: media beside the text on a wide screen, media
// stacked on top of it on a narrow one. A 104px thumbnail on a phone earns none
// of the space it costs, so below the `sm` breakpoint the image goes full-bleed
// across the top of the card instead.
//
// Statements and articles are deliberately NOT styled the same. A statement
// gets a green rail and a tinted card so that scrolling the list tells you which
// items are official MAI positions before you read a word of them; an article
// sits on plain white. The two carry different weight and the list should say so.
const PostRow = ({ post, compact = false }) => {
  const isStatement = post.type === 'STATEMENT';
  const href = postUrl(post);

  // The compact variant (the rail at the foot of a post) stays horizontal at
  // every width - those cards are small enough that stacking them would make
  // the rail taller than the thing it sits under.
  const stacks = !compact;

  // A real photograph is content and earns a full 16:9 banner. A generated
  // tile is decoration, so on a phone it takes a shallower band rather than
  // pushing the headline of every post further down the scroll.
  const hasPhoto = !isStatement && Boolean(post.coverImageUrl);

  return (
    <Box
      component="article"
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: stacks ? { xs: 'column', sm: 'row' } : 'row',
        gap: stacks ? { xs: 0, sm: 2.5, md: 3 } : 2,
        alignItems: 'stretch',
        // No padding at the top on a stacked card: the image runs to the card's
        // own edges there, and `overflow: hidden` clips it to the rounded corner.
        p: stacks ? { xs: 0, sm: 2.5 } : 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        borderLeftWidth: 4,
        borderLeftColor: isStatement ? 'primary.main' : 'divider',
        backgroundColor: isStatement ? 'rgba(46, 125, 50, 0.032)' : 'background.paper',
        transition: 'box-shadow 180ms ease, border-color 180ms ease',
        '&:hover': {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
          borderColor: isStatement ? 'primary.main' : 'rgba(0, 0, 0, 0.2)',
          borderLeftColor: isStatement ? 'primary.main' : 'rgba(0, 0, 0, 0.2)',
        },
        // The headline carries the only real link; the card-wide overlay below
        // makes the whole card clickable without nesting everything inside an
        // anchor, which would make the link text meaningless to a screen reader.
        '&:focus-within': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          flexShrink: 0,
          width: stacks ? { xs: '100%', sm: 180, md: 240 } : { xs: 84, sm: 96 },
          alignSelf: stacks ? { xs: 'stretch', sm: 'flex-start' } : 'flex-start',
          // A wide banner when it sits across the top of a card, a squarer tile
          // when it sits beside the text.
          aspectRatio: stacks
            ? { xs: hasPhoto ? '16 / 9' : '3 / 1', sm: '4 / 3' }
            : '4 / 3',
          borderRadius: stacks ? { xs: 0, sm: 1.5 } : 1.5,
          overflow: 'hidden',
          backgroundColor: 'background.default',
        }}
      >
        {!isStatement && post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt=""
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 180px, 240px"
          />
        ) : (
          <PostTile
            type={post.type}
            referenceCode={post.referenceCode}
            compact={compact}
          />
        )}
      </Box>

      {/* The stacked card has no outer padding, so the text column supplies
          its own below the full-bleed image. */}
      <Box sx={{ minWidth: 0, flexGrow: 1, p: stacks ? { xs: 2, sm: 0 } : 0 }}>
        {/* Kicker: what this is, and when. */}
        <Typography
          component="p"
          sx={{
            fontSize: compact ? '0.65rem' : '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: isStatement ? 'primary.dark' : 'text.secondary',
            mb: 0.75,
          }}
        >
          {isStatement ? 'Statement' : 'Article'}
          <Box component="span" sx={{ mx: 0.75, opacity: 0.5 }}>
            /
          </Box>
          <Box
            component="time"
            dateTime={toDateAttr(post.publishedAt)}
            sx={{ fontWeight: 600, letterSpacing: '0.06em' }}
          >
            {formatPostDate(post.publishedAt)}
          </Box>
        </Typography>

        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontSize: compact
              ? { xs: '0.95rem', md: '1.05rem' }
              : { xs: '1.15rem', sm: '1.35rem', md: '1.5rem' },
            fontWeight: 600,
            lineHeight: 1.3,
            mb: compact ? 0.5 : 1,
          }}
        >
          <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
            <Box
              component="span"
              sx={{
                '&:hover': { textDecoration: 'underline' },
                textUnderlineOffset: '3px',
                '&::after': { content: '""', position: 'absolute', inset: 0 },
              }}
            >
              {post.title}
            </Box>
          </Link>
        </Typography>

        {!compact && (
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 1.25,
              // Three lines keeps every row roughly the same height, so the
              // list scans evenly however long a summary happens to be.
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.displaySummary}
          </Typography>
        )}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ color: 'text.secondary' }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {isStatement
              ? post.issuedBy || ORG_NAME
              : post.authorName || 'Guest contributor'}
          </Typography>

          {!isStatement && !compact && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {`· ${readingMinutes(post.body)} min read`}
            </Typography>
          )}

          {isStatement && post.referenceCode && !compact && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {`· Ref ${post.referenceCode}`}
            </Typography>
          )}

          {!compact && post.topics?.length > 0 && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {`· ${post.topics.map(topicLabel).join(', ')}`}
            </Typography>
          )}
        </Stack>

        {!compact && (
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{
              mt: 1.5,
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            <span>{isStatement ? 'Read the statement' : 'Read the article'}</span>
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default PostRow;
