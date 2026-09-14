import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#2e7d32',
        pt: 8,
        pb: 3,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #2e7d32 0%, #4caf50 100%)',
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2, position: 'relative', width: 120, height: 120 }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: '#fff',
                  zIndex: 0,
                }}
              />
              <Image
                src="/assets/MAI LOGO.png"
                alt="MAI Logo"
                width={120}
                height={120}
                style={{ marginBottom: '1rem', position: 'relative', zIndex: 1 }}
              />
            </Box>
            <Typography variant="body2" color="#fff" sx={{ mb: 2, maxWidth: 300 }}>
              The Muslim Association of Ireland serves the Muslim community through education, 
              worship facilities, and community support services.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                href="https://facebook.com/MAITallaghtMosque"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#2e7d32',
                  '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.1)' }
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                href="https://instagram.com/mai_tallaghtmosque"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#2e7d32',
                  '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.1)' }
                }}
              >
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="#fff" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link href="/about" style={{ textDecoration: 'none' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#fff',
                    '&:hover': { color: '#4caf50' },
                    cursor: 'pointer'
                  }}
                >
                  About Us
                </Typography>
              </Link>
              <Link href="/events" style={{ textDecoration: 'none' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#fff',
                    '&:hover': { color: '#4caf50' },
                    cursor: 'pointer'
                  }}
                >
                  Events
                </Typography>
              </Link>
              <Link href="/facilities" style={{ textDecoration: 'none' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#fff',
                    '&:hover': { color: '#4caf50' },
                    cursor: 'pointer'
                  }}
                >
                  Facilities
                </Typography>
              </Link>
              <Link href="/faq" style={{ textDecoration: 'none' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#fff',
                    '&:hover': { color: '#4caf50' },
                    cursor: 'pointer'
                  }}
                >
                  FAQ
                </Typography>
              </Link>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="#fff" sx={{ mb: 2, fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ color: '#2e7d32' }} />
                <Typography variant="body2" color="#fff">
                  Greenhills Road, Tallaght, Dublin 24
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#2e7d32' }} />
                <Typography 
                  variant="body2" 
                  component="a"
                  href="mailto:info@mai.ie"
                  sx={{ 
                    color: '#fff',
                    textDecoration: 'none',
                    '&:hover': { color: '#4caf50' }
                  }}
                >
                  info@mai.ie
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#2e7d32' }} />
                <Typography 
                  variant="body2" 
                  component="a"
                  href="tel:+35312547375"
                  sx={{ 
                    color: '#fff',
                    textDecoration: 'none',
                    '&:hover': { color: '#4caf50' }
                  }}
                >
                  (01) 254 7375
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Copyright */}
        <Typography 
          variant="body2" 
          color="#fff" 
          align="center"
          sx={{ pt: 2 }}
        >
          © {currentYear} Muslim Association of Ireland. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default FooterSection; 