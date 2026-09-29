import React from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Box, Button, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventManager from '../../components/admin/EventManager';
import { requireUser } from '../../lib/auth';

// Moved off the old ProtectedRoute component, which only checked for a
// localStorage flag that any visitor could set for themselves - and which the
// sign-in page no longer writes now that sessions are real. The guard now runs
// on the server, so the page never reaches the browser without a valid session.
//
// EventManager brings its own page heading and padding, so this is NOT wrapped
// in AdminShell the way the newsroom pages are - that would give it two
// headings. It gets the one thing the shell would have provided and it lacks:
// a way back to /admin.
export default function AdminEvents() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Box sx={{ bgcolor: 'background.default', pt: 3 }}>
        <Container maxWidth="lg">
          <Button component={Link} href="/admin" size="small" startIcon={<ArrowBackIcon />} sx={{ ml: -1 }}>
            Admin
          </Button>
        </Container>
      </Box>
      <EventManager />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireUser(ctx as any);
  if ('redirect' in auth) return auth as any;
  return { props: { user: auth.user } };
};
