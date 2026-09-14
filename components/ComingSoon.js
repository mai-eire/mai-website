import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import Link from 'next/link';

// Placeholder for pages that are still being built.
const ComingSoon = ({ title, description }) => {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 88,
              height: 88,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              mb: 4,
            }}
          >
            <ConstructionIcon sx={{ fontSize: 44 }} />
          </Box>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontFamily: 'Lora',
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: '2.25rem', md: '3rem' },
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              mb: 5,
              lineHeight: 1.7,
            }}
          >
            {description ||
              "This page is a work in progress. We're putting it together and it will be available soon, insha'Allah."}
          </Typography>

          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Button variant="contained" size="large" sx={{ px: 4, py: 1.5 }}>
              Back to Home
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default ComingSoon;
