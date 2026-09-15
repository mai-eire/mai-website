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
import XIcon from '@mui/icons-material/X';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { SOCIAL_LINKS } from '../../data/socials';

// Keyed by the stable `id` in data/socials.js, so `label` stays free to reword.
const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  x: XIcon,
};

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
            <Box sx={{ mb: 2 }}>
              <Image
                src="/assets/MAI_Logo_White.png"
                alt="MAI Logo"
                width={160}
                height={70}
                style={{ marginBottom: '1rem' }}
              />
            </Box>
            <Typography variant="body2" color="#fff" sx={{ mb: 2, maxWidth: 300 }}>
              MAI serves the Muslim community through education, 
              worship facilities, and community support services.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                color: 'rgba(255, 255, 255, 0.65)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                fontSize: '0.75rem',
              }}
            >
              Follow us
            </Typography>
            {/* White discs carrying each platform's own colour — the glyphs
                read clearly against the green, and hover floods the disc with
                the brand colour (Instagram gets its gradient). */}
            <Stack direction="row" spacing={1.5}>
              {SOCIAL_LINKS.map(({ id, label, href, brand, gradient }) => {
                const Icon = SOCIAL_ICONS[id];
                // An unrecognised id drops that one link rather than taking
                // the whole page down with an undefined element type.
                if (!Icon) return null;
                return (
                  <IconButton
                    key={id}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`MAI on ${label}`}
                    sx={{
                      width: 44,
                      height: 44,
                      color: brand,
                      bgcolor: '#ffffff',
                      transition:
                        'transform 200ms ease, box-shadow 200ms ease, color 200ms ease, background 200ms ease',
                      '&:hover': {
                        color: '#ffffff',
                        background: gradient || brand,
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 18px rgba(0, 0, 0, 0.3)',
                      },
                      '&:focus-visible': {
                        outline: '2px solid #ffffff',
                        outlineOffset: 3,
                      },
                      '@media (prefers-reduced-motion: reduce)': {
                        transition: 'none',
                        '&:hover': { transform: 'none' },
                      },
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                );
              })}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="#fff" sx={{ mb: 2, fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ color: '#a5d6a7' }} />
                <Typography variant="body2" color="#fff">
                  Greenhills Road, Tallaght, Dublin 24
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#a5d6a7' }} />
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
                <PhoneIcon sx={{ color: '#a5d6a7' }} />
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

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.22)' }} />

        {/* Copyright */}
        <Typography 
          variant="body2" 
          color="#fff" 
          align="center"
          sx={{ pt: 2 }}
        >
          © {currentYear} MAI. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default FooterSection; 