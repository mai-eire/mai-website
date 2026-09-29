import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PostSeo from './PostSeo';
import PostBody from './PostBody';
import SharePost from './SharePost';
import RelatedPosts from './RelatedPosts';
import { absoluteUrl, formatPostDate, postUrl, toDateAttr, topicLabel } from './postFormatting';
import { ORG_NAME, PRESS_DEPARTMENT_ID } from '../../data/posts';

// A statement is an official document. The template is deliberately austere -
// letterhead-style masthead, no cover image, a single narrow column of serif
// text - because it needs to read as a record of the organisation's position
// rather than as web content. Everything a journalist needs to cite it (date,
// issuing body, reference, a PDF, a named contact) is on the page.
const StatementView = ({ post, related, preview = false }) => {
  const url = absoluteUrl(postUrl(post));

  return (
    <>
      {/* A preview must not emit a canonical URL or a social card for a
          post that is not published. The preview page sets noindex instead. */}
      {!preview && <PostSeo post={post} />}

      <Box component="article" sx={{ backgroundColor: 'background.paper' }}>
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
          {/* One column, one measure. The masthead, the summary and the body
              all share this width so the page reads as a single document
              rather than a wide header sitting over a narrow body. */}
          <Box sx={{ maxWidth: 680, mx: 'auto' }}>
          <Button
            component={Link}
            href="/news?type=STATEMENT"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 3, ml: -1 }}
          >
            All statements
          </Button>

          {/* Masthead: the visual cue that this speaks for the organisation. */}
          <Box
            sx={{
              borderTop: '4px solid',
              borderColor: 'primary.main',
              pt: 3,
              mb: 4,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Image src="/assets/MAI_Logo.png" alt="MAI" width={84} height={36} />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'primary.main',
                  }}
                >
                  Official Statement
                </Typography>
              </Stack>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {/* A published post always has a date; a draft being previewed
                    does not, and an empty <time> left a stray separator. */}
                {post.publishedAt ? (
                  <Box component="time" dateTime={toDateAttr(post.publishedAt)}>
                    {formatPostDate(post.publishedAt)}
                  </Box>
                ) : (
                  'Not published yet'
                )}
                {post.referenceCode ? ` · Ref ${post.referenceCode}` : ''}
              </Typography>
            </Stack>

            <Typography variant="h2" component="h1" sx={{ mb: 2 }}>
              {post.title}
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{ color: 'text.secondary', fontWeight: 400, mb: 2 }}
            >
              {post.displaySummary}
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {`Issued by ${post.issuedBy || ORG_NAME}`}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Serif body: long-form reading, and it matches how the same text
              looks on the PDF version. */}
          <Box sx={{ '& p, & li': { fontFamily: '"Lora", serif', lineHeight: 1.75 } }}>
            <PostBody body={post.body} />
          </Box>

          {post.topics?.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 5 }}>
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
            {post.pdfUrl ? (
              <Button
                variant="outlined"
                startIcon={<PictureAsPdfIcon />}
                component="a"
                href={post.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download as PDF
              </Button>
            ) : (
              <span />
            )}
            <SharePost url={url} title={post.title} />
          </Stack>

          {/* Press contact. Routes through the Media department in
              data/departments.js rather than hardcoding an address. */}
          <Box
            sx={{
              mt: 5,
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.default',
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Media enquiries
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              For comment, clarification or interview requests relating to this statement,
              please contact our Media team.
            </Typography>
            <Button
              size="small"
              variant="contained"
              component={Link}
              href={`/contact?department=${PRESS_DEPARTMENT_ID}`}
            >
              Contact the Media team
            </Button>
          </Box>
          </Box>
        </Container>
      </Box>

      <RelatedPosts posts={related} />
    </>
  );
};

export default StatementView;
