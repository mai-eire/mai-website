import React from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import AddIcon from '@mui/icons-material/Add';
import AdminShell from '../../components/admin/AdminShell';
import { requireUser } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

// The back office landing page. /admin used to 404, which meant the only way in
// was to know a deeper URL by heart. It is deliberately just a signpost: the
// work happens in the sections it links to.
export default function AdminHomePage({ user, counts }: any) {
  const sections = [
    {
      href: '/admin/posts',
      icon: <ArticleOutlinedIcon sx={{ fontSize: 32 }} />,
      title: 'Statements & Articles',
      description:
        'Write, edit and publish official statements and opinion pieces for the Newsroom.',
      chips: [
        { label: `${counts.published} published`, highlight: false },
        // Drafts are the thing worth noticing on arrival - something started
        // and not finished - so they only appear when there are any.
        ...(counts.drafts > 0
          ? [{ label: `${counts.drafts} draft${counts.drafts === 1 ? '' : 's'}`, highlight: true }]
          : []),
      ],
    },
    {
      href: '/admin/events',
      icon: <EventOutlinedIcon sx={{ fontSize: 32 }} />,
      title: 'Events',
      description: 'Manage the events listing.',
      chips: [],
    },
  ];

  return (
    <AdminShell
      user={user}
      title="Admin"
      subtitle="Manage what appears on the site."
      actions={
        <Button
          component={Link}
          href="/admin/posts/new"
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
        >
          New post
        </Button>
      }
    >
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} key={section.href}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                transition: 'box-shadow 180ms ease',
                '&:hover': { boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)' },
                '&:focus-within': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 2,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ color: 'primary.main', mb: 1.5 }}>{section.icon}</Box>

                <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
                  <Link
                    href={section.href}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {/* Stretches the link over the whole card without nesting
                        the rest of the content inside the anchor. */}
                    <Box
                      component="span"
                      sx={{ '&::after': { content: '""', position: 'absolute', inset: 0 } }}
                    >
                      {section.title}
                    </Box>
                  </Link>
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {section.description}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {section.chips.map((chip) => (
                    <Chip
                      key={chip.label}
                      size="small"
                      label={chip.label}
                      color={chip.highlight ? 'primary' : 'default'}
                      variant={chip.highlight ? 'filled' : 'outlined'}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireUser(ctx as any);
  if ('redirect' in auth) return auth as any;

  const [published, drafts] = await Promise.all([
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
  ]);

  return { props: { user: auth.user, counts: { published, drafts } } };
};
