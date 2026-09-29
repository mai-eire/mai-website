import React from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import AdminShell from '../../../components/admin/AdminShell';
import PostList from '../../../components/admin/PostList';
import { requireUser } from '../../../lib/auth';
import { listAllPosts } from '../../../lib/posts';

export default function AdminPostsPage({ user, posts }: any) {
  const drafts = posts.filter((p: any) => p.status === 'DRAFT').length;

  return (
    <AdminShell
      user={user}
      title="Statements & Articles"
      subtitle={
        posts.length === 0
          ? 'Nothing written yet.'
          : `${posts.length} post${posts.length === 1 ? '' : 's'}${
              drafts ? ` · ${drafts} unfinished` : ''
            }`
      }
      backTo={{ href: '/admin', label: 'Admin' }}
      actions={
        <Button
          component={Link}
          href="/admin/posts/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          New post
        </Button>
      }
    >
      <PostList posts={posts} />
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireUser(ctx as any);
  if ('redirect' in auth) return auth as any;

  const posts = await listAllPosts();
  return { props: { user: auth.user, posts } };
};
