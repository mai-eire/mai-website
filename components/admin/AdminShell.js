import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Chrome for the back office.
//
// _app.tsx leaves the public navbar and footer off /admin/*, so this is the
// only chrome an admin page gets. It carries the things that belong to the
// session rather than to the page - who you are, the way out, a link to the
// live site - and keeps them in one slim bar, so each page below is free to be
// about its own content.
/**
 * @param {{
 *   user?: { name?: string | null, email?: string } | null,
 *   title: React.ReactNode,
 *   subtitle?: React.ReactNode,
 *   backTo?: { href: string, label: string } | null,
 *   actions?: React.ReactNode,
 *   children?: React.ReactNode,
 * }} props
 */
const AdminShell = ({ user, title, subtitle, backTo, actions, children }) => {
  const router = useRouter();

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <>
      <Head>
        <title key="title">{`${title} | MAI Newsroom`}</title>
        {/* The back office must never turn up in a search result. */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Container maxWidth="lg" disableGutters>
            <Toolbar sx={{ gap: 2, minHeight: { xs: 56, sm: 60 } }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                component={Link}
                href="/admin"
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Image src="/assets/MAI_Logo.png" alt="MAI" width={56} height={24} />
                <Typography
                  sx={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  Admin
                </Typography>
              </Stack>

              <Box sx={{ flexGrow: 1 }} />

              {/* On a phone these drop to icons. With their labels they wrapped
                  onto two lines each and doubled the height of the bar. */}
              <Tooltip title="Open the public site in a new tab">
                <Button
                  component={Link}
                  href="/news"
                  target="_blank"
                  size="small"
                  aria-label="View site"
                  startIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                    px: { xs: 1, sm: 1.5 },
                    '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 }, ml: 0 },
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    View site
                  </Box>
                </Button>
              </Tooltip>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ my: 1.5, display: { xs: 'none', sm: 'block' } }}
              />

              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', display: { xs: 'none', md: 'block' } }}
              >
                {user?.name || user?.email}
              </Typography>

              <Tooltip title="Sign out">
                <Button
                  size="small"
                  onClick={signOut}
                  aria-label="Sign out"
                  startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                    px: { xs: 1, sm: 1.5 },
                    '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 }, ml: 0 },
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Sign out
                  </Box>
                </Button>
              </Tooltip>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
          {/* Every page except the hub offers a way back to it. */}
          {backTo && router.pathname !== '/admin' && (
            <Button
              component={Link}
              href={backTo.href}
              size="small"
              startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              sx={{ ml: -1, mb: 1, color: 'text.secondary' }}
            >
              {backTo.label}
            </Button>
          )}

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'flex-start' }}
            spacing={2}
            sx={{ mb: { xs: 3, md: 4 } }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" component="h1">
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>

            {actions && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ flexShrink: 0 }}
              >
                {actions}
              </Stack>
            )}
          </Stack>

          {children}
        </Container>
      </Box>
    </>
  );
};

export default AdminShell;
