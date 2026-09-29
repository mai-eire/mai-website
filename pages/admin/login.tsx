import React from 'react';
import type { GetServerSideProps } from 'next';
import AdminLogin from '../../components/admin/AdminLogin';
import { getSessionUser } from '../../lib/auth';

export default function AdminLoginPage() {
  return <AdminLogin />;
}

// Someone already signed in has no use for the login form.
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getSessionUser(req as any).catch(() => null);
  if (user) {
    return { redirect: { destination: '/admin', permanent: false } };
  }
  return { props: {} };
};
