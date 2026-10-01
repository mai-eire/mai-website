import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import FooterSection from '../components/landing/FooterSection';
import Head from 'next/head';

// Import Google Fonts
import '@fontsource/lora/400.css';
import '@fontsource/lora/500.css';
import '@fontsource/lora/600.css';
import '@fontsource/lora/700.css';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/600.css';
import '@fontsource/source-sans-pro/700.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#757575',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
    },
    background: {
      default: '#f7fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Source Sans Pro", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Lora", serif',
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Lora", serif',
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Lora", serif',
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Lora", serif',
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Lora", serif',
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Lora", serif',
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: '"Source Sans Pro", sans-serif',
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontFamily: '"Source Sans Pro", sans-serif',
        },
        contained: {
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1b5e20',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // The back office is a tool, not a page of the website. It gets its own slim
  // chrome from AdminShell instead of the public marketing navbar and the big
  // green footer, which cost a screenful on every admin page and blur the line
  // between editing the site and browsing it.
  // /admin/drafts is the exception: it previews a post as its published page,
  // so it needs the real navbar and footer around it.
  const isAdmin =
    router.pathname.startsWith('/admin') && !router.pathname.startsWith('/admin/drafts');

  return (
    <ThemeProvider theme={theme}>
      <Head>
        {/* Site-wide defaults. Every tag a page might need to override carries a
            `key`: Next only replaces a tag from _app when the page renders one
            with the SAME key, and without that a shared statement or article
            would show this generic card instead of its own headline. */}
        <link rel="icon" type="image/png" href="/assets/MAI_Logo_Icon.png" />
        <title key="title">MAI Muslim Center</title>
        <meta key="description" name="description" content="MAI Muslim Center is dedicated to supporting Muslims in Ireland and promoting Islamic values." />
        <meta name="keywords" content="Tallaght Mosque, Muslim Association of Ireland, MAI, Ireland Mosque, Islamic Centre, Dublin Mosque, Muslim Community Ireland" />
        <meta name="author" content="MAI" />
        {/* Open Graph Meta Tags for Social Sharing */}
        <meta key="og:title" property="og:title" content="MAI Muslim Center" />
        <meta key="og:description" property="og:description" content="Serving the Muslim community in Ireland through education, worship, and support." />
        <meta key="og:image" property="og:image" content="https://new.mai.ie/assets/og-hero.jpg" />
        <meta key="og:url" property="og:url" content="https://new.mai.ie/" />
        <meta key="og:type" property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="MAI Muslim Center" />
        <meta key="twitter:description" name="twitter:description" content="Serving the Muslim community in Ireland through education, worship, and support." />
        <meta key="twitter:image" name="twitter:image" content="https://new.mai.ie/assets/og-hero.jpg" />
      </Head>
      <CssBaseline />
      {!isAdmin && <Navbar />}
      <Component {...pageProps} />
      {!isAdmin && <FooterSection />}
    </ThemeProvider>
  );
}

export default MyApp; 