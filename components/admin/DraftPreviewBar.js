import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Alert, Box, Button, Container, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { postUrl } from '../news/postFormatting';

// The bar across the top of a preview.
//
// A preview is the published page, exactly - which is the whole point of it,
// and also the danger: nothing else on the page says this post is not live.
// So the bar is sticky and sits above the site's own header. The public navbar
// slides underneath it on scroll, which is a fair trade for never being able
// to scroll the warning off the screen.
const DraftPreviewBar = ({ post }) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isLive = post.status === 'PUBLISHED';

  const publish = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // The post is sent back as it stands: publishing from here must not be
        // a way to change anything else about it.
        body: JSON.stringify({ ...post, status: 'PUBLISHED' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data.errors || [data.error])[0] || 'Could not publish this post.');
        return;
      }
      router.push(postUrl(data.post));
    } catch {
      setError('Could not reach the server. Nothing was published.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        // Above MUI's AppBar (1100), which is what the public navbar uses.
        zIndex: 1300,
        backgroundColor: isLive ? '#1b5e20' : '#8a5a00',
        color: 'common.white',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1.5, sm: 2 }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ py: 1.25 }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <VisibilityOffIcon sx={{ fontSize: 18, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {isLive ? 'Live post' : 'Draft preview'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              {isLive
                ? '— this is the published page.'
                : '— nobody but you can see this. It is not on the newsroom and its public address returns 404.'}
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <Button
              component={Link}
              href={`/admin/posts/${post.id}`}
              size="small"
              variant="outlined"
              startIcon={<EditIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: 'common.white',
                borderColor: 'rgba(255, 255, 255, 0.6)',
                '&:hover': { borderColor: 'common.white' },
              }}
            >
              Back to editing
            </Button>

            {isLive ? (
              <Button
                component={Link}
                href={postUrl(post)}
                size="small"
                variant="contained"
                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                sx={{
                  backgroundColor: 'common.white',
                  color: 'primary.dark',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.88)' },
                }}
              >
                View live page
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                disabled={busy}
                onClick={publish}
                sx={{
                  backgroundColor: 'common.white',
                  color: '#8a5a00',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.88)' },
                }}
              >
                Publish
              </Button>
            )}
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 1.5 }}>
            {error}
          </Alert>
        )}
      </Container>
    </Box>
  );
};

export default DraftPreviewBar;
