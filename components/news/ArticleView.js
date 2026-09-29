import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PostSeo from './PostSeo';
import PostBody from './PostBody';
import SharePost from './SharePost';
import RelatedPosts from './RelatedPosts';
import {
  absoluteUrl,
  formatPostDate,
  postUrl,
  readingMinutes,
  toDateAttr,
  topicLabel,
} from './postFormatting';
import { ORG_NAME, PRESS_DEPARTMENT_ID } from '../../data/posts';

// An article is one person's opinion. Where the statement template is austere
// and anonymous, this one is warm and personal: a cover image, a prominent
// byline, reading time. The disclaimer below is the important part - an
// outside submission must never be mistaken for an MAI position.
const ArticleView = ({ post, related, preview = false }) => {
  const url = absoluteUrl(postUrl(post));

  return (
    <>
      {/* A preview must not emit a canonical URL or a social card for a
          post that is not published. The preview page sets noindex instead. */}
      {!preview && <PostSeo post={post} />}

      <Box component="article" sx={{ backgroundColor: 'background.paper' }}>
        {post.coverImageUrl && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 220, md: 420 },
              backgroundColor: 'background.default',
            }}
          >
            <Image
              src={post.coverImageUrl}
              alt=""
              fill
              priority
              style={{ objectFit: 'cover' }}
              sizes="100vw"
            />
          </Box>
        )}

        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
          {/* One column, one measure - see the note in StatementView. */}
          <Box sx={{ maxWidth: 680, mx: 'auto' }}>
          <Button
            component={Link}
            href="/news?type=ARTICLE"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 3, ml: -1 }}
          >
            All articles
          </Button>

          <Typography variant="h2" component="h1" sx={{ mb: 2 }}>
            {post.title}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{ color: 'text.secondary', fontWeight: 400, mb: 3 }}
          >
            {post.displaySummary}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Avatar
              src={post.authorPhotoUrl || undefined}
              alt=""
              sx={{ width: 48, height: 48 }}
            >
              {(post.authorName || '?').charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2">
                {post.authorName || 'Guest contributor'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {post.authorTitle ? `${post.authorTitle} · ` : ''}
                {/* A published post always has a date; a draft being previewed
                    does not, and an empty <time> left a stray separator. */}
                {post.publishedAt ? (
                  <Box component="time" dateTime={toDateAttr(post.publishedAt)}>
                    {formatPostDate(post.publishedAt)}
                  </Box>
                ) : (
                  'Not published yet'
                )}
                {` · ${readingMinutes(post.body)} min read`}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 4 }} />

          <PostBody body={post.body} />

          {/* Shown for outside submissions only. MAI publishes these to host a
              conversation, not to endorse every view in them, and saying so on
              the page itself is what keeps that distinction clear. */}
          {post.isExternalSubmission && (
            <Alert severity="info" sx={{ mt: 4 }}>
              This article was submitted by a guest contributor. The views expressed are
              the author&apos;s own and do not necessarily reflect the position of{' '}
              {ORG_NAME}. Our official positions are published as{' '}
              <Link href="/news?type=STATEMENT">statements</Link>.
            </Alert>
          )}

          {post.topics?.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 4 }}>
              {post.topics.map((id) => (
                <Chip
                  key={id}
                  label={topicLabel(id)}
                  size="small"
                  component={Link}
                  href={`/news?topic=${id}`}
                  clickable
                  variant="outlined"
                />
              ))}
            </Stack>
          )}

          <Divider sx={{ my: 4 }} />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Button
              size="small"
              component={Link}
              href={`/contact?department=${PRESS_DEPARTMENT_ID}`}
            >
              Submit an article
            </Button>
            <SharePost url={url} title={post.title} />
          </Stack>
          </Box>
        </Container>
      </Box>

      <RelatedPosts posts={related} />
    </>
  );
};

export default ArticleView;
