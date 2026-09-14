import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import Link from 'next/link';

const CallToActionSection = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              mb: 3,
              fontFamily: 'Lora',
              fontWeight: 600,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Join Our Community
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontSize: { xs: '1rem', md: '1.125rem' }
            }}
          >
            Be part of our growing community. Support our initiatives and help us make a difference.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Link href="/events" passHref style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                View Events
              </Button>
            </Link>
            {/* TODO: Patron flow not ready yet — re-enable when /dashboard works.
            <Link href="/dashboard" passHref style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                Become a Patron
              </Button>
            </Link>
            */}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CallToActionSection; 