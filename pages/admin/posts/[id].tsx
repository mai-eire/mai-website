import React from 'react';
import type { GetServerSideProps } from 'next';
import AdminShell from '../../../components/admin/AdminShell';
import PostEditor from '../../../components/admin/PostEditor';
import { requireUser } from '../../../lib/auth';
import { getPostById } from '../../../lib/posts';
import { getPostType } from '../../../data/posts';

export default function EditPostPage({ user, post }: any) {
  return (
    <AdminShell
      user={user}
      // The status is already shown in the editor's action bar, so the heading
      // says what this is rather than repeating it.
      title={`Edit ${getPostType(post.type).label.toLowerCase()}`}
      backTo={{ href: '/admin/posts', label: 'Statements & Articles' }}
    >
      <PostEditor post={post} />
    </AdminShell>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireUser(ctx as any);
  if ('redirect' in auth) return auth as any;

  const post = await getPostById(String(ctx.params?.id));
  if (!post) return { notFound: true };

  return { props: { user: auth.user, post } };
};
