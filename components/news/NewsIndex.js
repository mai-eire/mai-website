import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Alert, Box, Button, Container, Stack, Typography } from '@mui/material';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import PostRow from './PostRow';
import PostFilters from './PostFilters';
import { absoluteUrl } from './postFormatting';
import {
  ORG_NAME,
  ORG_SEO_NAME,
  PRESS_DEPARTMENT_ID,
  getPostType,
} from '../../data/posts';

// The Newsroom. One page for both statements and articles; ?type= narrows it.
const NewsIndex = ({ activeType, activeTopic, topicOptions, initial }) => {
  const [posts, setPosts] = useState(initial.posts);
  const [page, setPage] = useState(initial.page);
  const [hasMore, setHasMore] = useState(initial.hasMore);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  // A filter change re-runs getServerSideProps and arrives as new props, so the
  // locally accumulated "load more" pages must be reset to match.
  useEffect(() => {
    setPosts(initial.posts);
    setPage(initial.page);
    setHasMore(initial.hasMore);
    setLoadError('');
  }, [initial]);

  const loadMore = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const params = new URLSearchParams({ page: String(page + 1) });
      if (activeType) params.set('type', activeType);
      if (activeTopic) params.set('topic', activeTopic);
      const res = await fetch(`/api/posts?${params.toString()}`);
      if (!res.ok) throw new Error('Could not load more posts');
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setPage(data.page);
      setHasMore(data.hasMore);
    } catch {
      setLoadError('Something went wrong loading more posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // The heading and description follow the filter, so a link to
  // /news?type=STATEMENT still arrives as a page about statements - including
  // for anyone who sees only the shared preview card.
  const typeMeta = activeType ? getPostType(activeType) : null;
  const heading = typeMeta ? typeMeta.pluralLabel : 'Newsroom';

  // Two versions of the same sentence: `intro` is what a visitor reads and
  // calls us MAI; `metaDescription` is what search engines and social cards
  // get, and carries the long name. See the note on ORG_NAME in data/posts.js.
  const intro = typeMeta
    ? typeMeta.blurb
    : `Official statements, articles and updates from ${ORG_NAME}.`;
  const metaDescription = typeMeta
    ? typeMeta.metaDescription
    : `Official statements, articles and updates from the ${ORG_SEO_NAME} (${ORG_NAME}).`;

  const canonical = absoluteUrl(activeType ? `/news?type=${activeType}` : '/news');

  return (
    <>
      <Head>
        <title key="title">{`${heading} | MAI Muslim Center`}</title>
        <meta key="description" name="description" content={metaDescription} />
        <link rel="canonical" href={canonical} />
        <meta key="og:title" property="og:title" content={`${heading} | MAI`} />
        <meta key="og:description" property="og:description" content={metaDescription} />
        <meta key="og:url" property="og:url" content={canonical} />
        <meta key="og:type" property="og:type" content="website" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="MAI Newsroom"
          href="/news/rss.xml"
        />
      </Head>

      <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh' }}>
        <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography variant="h2" component="h1" sx={{ mb: 1.5 }}>
              {heading}
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: '58ch' }}
            >
              {intro}
            </Typography>
          </Box>

          <PostFilters
            activeType={activeType}
            activeTopic={activeTopic}
            topicOptions={topicOptions}
          />

          {posts.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Nothing here yet
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {activeTopic || activeType
                  ? 'Nothing matches this filter yet. Try another.'
                  : 'New statements and articles will appear here as they are published.'}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={{ xs: 2, md: 2.5 }}>
              {posts.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </Stack>
          )}

          {loadError && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {loadError}
            </Alert>
          )}

          {hasMore && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button variant="outlined" onClick={loadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load more'}
              </Button>
            </Box>
          )}

          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Press enquiries and article submissions
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '48ch' }}>
                Journalists seeking comment, and writers who would like to submit an
                article, can reach our Media team directly.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                size="small"
                startIcon={<RssFeedIcon />}
                component={Link}
                href="/news/rss.xml"
              >
                RSS
              </Button>
              <Button
                size="small"
                variant="contained"
                component={Link}
                href={`/contact?department=${PRESS_DEPARTMENT_ID}`}
              >
                Contact Media team
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NewsIndex;
