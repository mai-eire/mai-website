import React from 'react';
import type { GetServerSideProps } from 'next';
import AdminShell from '../../../components/admin/AdminShell';
import PostEditor from '../../../components/admin/PostEditor';
import { requireUser } from '../../../lib/auth';

export default function NewPostPage({ user }: any) {
  return (
    <AdminShell
      user={user}
      title="New post"
      backTo={{ href: '/admin/posts', label: 'Statements & Articles' }}
    >
      <PostEditor post={null} />
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireUser(ctx as any);
  if ('redirect' in auth) return auth as any;
  return { props: { user: auth.user } };
};
