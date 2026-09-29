import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

// Replaces the previous hardcoded-credentials login. Credentials now go to
// /api/auth/login, which checks a bcrypt hash and sets an httpOnly session
// cookie - nothing about the session is readable or forgeable from the browser.
const AdminLogin = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not sign in');
        return;
      }

      // Return them to wherever they were headed before the redirect to login.
      // Only same-site paths are accepted, so ?next= cannot be used to bounce
      // a signed-in editor to another domain.
      const next = typeof router.query.next === 'string' ? router.query.next : '';
      const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/admin';
      router.push(safeNext);
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Head>
        <title key="title">Sign in | MAI Newsroom</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Container maxWidth="sm">
        <Box sx={{ mt: 10, mb: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Newsroom sign in
            </Typography>
            <Typography
              variant="body2"
              align="center"
              sx={{ color: 'text.secondary', mb: 3 }}
            >
              For MAI editors publishing statements and articles.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                required
                label="Email"
                type="email"
                autoComplete="username"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                label="Password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                sx={{ mb: 3 }}
              />
              <Button type="submit" variant="contained" fullWidth disabled={busy}>
                {busy ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default AdminLogin;
