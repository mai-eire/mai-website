import React from 'react';
import Link from 'next/link';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import PostRow from './PostRow';

// The rail at the foot of a post. Compact variants of the same row used on the
// newsroom list, so a reader moves between the two without a change of idiom.
const RelatedPosts = ({ posts }) => {
  if (!posts?.length) return null;

  return (
    <Box sx={{ backgroundColor: 'background.default', py: { xs: 5, md: 7 } }}>
      <Container maxWidth="md">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
          sx={{ mb: 2 }}
        >
          <Typography variant="h5" component="h2">
            More from the Newsroom
          </Typography>
          <Button size="small" component={Link} href="/news">
            See all
          </Button>
        </Stack>

        <Stack spacing={1.5}>
          {posts.map((post) => (
            <PostRow key={post.id} post={post} compact />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default RelatedPosts;
