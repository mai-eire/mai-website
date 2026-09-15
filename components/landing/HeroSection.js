import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Image from 'next/image';
import { SOCIAL_LINKS } from '../../data/socials';

// Deep warm brown pulled from the prayer hall photo — used so the section never
// flashes white before the image decodes.
const INK = '20, 13, 6';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

// Staggered entrance for each block of hero content.
const riseIn = (delay) => ({
  opacity: 0,
  animation: 'heroRise 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
  animationDelay: delay,
  [reducedMotion]: {
    animation: 'none',
    opacity: 1,
    transform: 'none',
  },
});

const HeroSection = () => {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        '@supports (height: 100svh)': { height: '100svh' },
        minHeight: { xs: 600, md: 680 },
        maxHeight: 1100,
        overflow: 'hidden',
        bgcolor: `rgb(${INK})`,
        '@keyframes heroRise': {
          from: { opacity: 0, transform: 'translateY(28px)' },
          to: { opacity: 1, transform: 'none' },
        },
        '@keyframes heroDrift': {
          from: { transform: 'scale(1.02)' },
          to: { transform: 'scale(1.12)' },
        },
        '@keyframes heroCue': {
          '0%, 100%': { transform: 'translateY(0)', opacity: 0.55 },
          '50%': { transform: 'translateY(6px)', opacity: 1 },
        },
      }}
    >
      {/* Photograph — slow push in, so the space feels alive rather than static */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          animation: 'heroDrift 28s ease-out forwards',
          [reducedMotion]: { animation: 'none', transform: 'scale(1.02)' },
        }}
      >
        <Image
          src="/assets/tallaght_mosque.jpg"
          alt="The prayer hall at the MAI Muslim Center, its carved walnut mihrab wall lit from above"
          fill
          sizes="100vw"
          quality={85}
          style={{ objectFit: 'cover', objectPosition: 'center 55%' }}
          priority
        />
      </Box>

      {/* Scrims: one to seat the type on the left, one for the footer row,
          one to keep the overlaid navbar legible against a bright frame */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: [
            `linear-gradient(to right, rgba(${INK}, 0.86) 0%, rgba(${INK}, 0.62) 38%, rgba(${INK}, 0.18) 72%, rgba(${INK}, 0) 100%)`,
            `linear-gradient(to top, rgba(${INK}, 0.72) 0%, rgba(${INK}, 0) 32%)`,
            `linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0) 18%)`,
          ].join(', '),
        }}
      />

      {/* Content */}
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 3, sm: 4, md: 6 },
          pt: { xs: 12, md: 14 },
          pb: { xs: 14, md: 16 },
        }}
      >
        <Box sx={{ maxWidth: 720 }}>
          {/* Rule — carries the composition now that the location line is gone */}
          <Box
            sx={{
              width: 72,
              height: 2,
              mb: { xs: 4, md: 5 },
              bgcolor: 'primary.light',
              transformOrigin: 'left',
              ...riseIn('80ms'),
            }}
          />

          <Typography
            component="h1"
            sx={{
              fontFamily: 'Lora, serif',
              fontWeight: 400,
              fontSize: 'clamp(2.75rem, 7vw, 5.5rem)',
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              textShadow: '0 2px 40px rgba(0, 0, 0, 0.45)',
              mb: { xs: 3, md: 4 },
              ...riseIn('180ms'),
            }}
          >
            <Box component="span" sx={{ display: 'block' }}>MAI Muslim</Box>
            <Box component="span" sx={{ display: 'block' }}>Center</Box>
          </Typography>

          <Typography
            sx={{
              maxWidth: 560,
              fontSize: 'clamp(1.05rem, 1.5vw, 1.3rem)',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.82)',
              mb: { xs: 5, md: 6 },
              ...riseIn('320ms'),
            }}
          >
            We're raising Muslims who are spiritually grounded, 
            intellectually sharp, and rooted in the society they serve.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: { xs: 'stretch', sm: 'center' }, ...riseIn('460ms') }}
          >
            <Button
              variant="contained"
              component="a"
              href="https://donate.stripe.com/4gw17p7F05CM3dKeV0"
              target="_blank"
              rel="noopener noreferrer"
              disableElevation
              sx={{
                bgcolor: 'primary.main',
                color: '#ffffff',
                borderRadius: 0,
                px: 5,
                py: 1.75,
                fontSize: '1.05rem',
                textTransform: 'none',
                transition: 'background-color 200ms ease, transform 200ms ease',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Donate
            </Button>
            <Button
              variant="outlined"
              component="a"
              startIcon={<PlaceIcon />}
              href="https://www.google.com/maps/search/?api=1&query=Tallaght+Mosque,+Greenhills+Rd,+Tymon+North,+Dublin"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.45)',
                borderWidth: 1,
                color: '#ffffff',
                borderRadius: 0,
                px: 5,
                py: 1.75,
                fontSize: '1.05rem',
                textTransform: 'none',
                backdropFilter: 'blur(2px)',
                transition: 'border-color 200ms ease, background-color 200ms ease, transform 200ms ease',
                '&:hover': {
                  borderWidth: 1,
                  borderColor: '#ffffff',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Find Us
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Bottom edge: socials and scroll cue, kept quiet so they never compete
          with the headline */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          ...riseIn('640ms'),
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            px: { xs: 3, sm: 4, md: 6 },
            py: { xs: 2, md: 2.5 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.14)',
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography
              component="span"
              sx={{
                display: { xs: 'none', md: 'block' },
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.4)',
              }}
            >
              Follow us
            </Typography>
            {SOCIAL_LINKS.map((social) => (
              <Button
                key={social.id}
                variant="text"
                component="a"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  minWidth: 'auto',
                  p: 0,
                  fontSize: '0.8125rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.68)',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: '#ffffff',
                  },
                }}
              >
                {social.label}
              </Button>
            ))}
          </Stack>

          <Box
            aria-hidden
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1,
              color: 'rgba(255, 255, 255, 0.55)',
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              Scroll
            </Typography>
            <KeyboardArrowDownIcon
              fontSize="small"
              sx={{
                animation: 'heroCue 2.4s ease-in-out infinite',
                [reducedMotion]: { animation: 'none' },
              }}
            />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HeroSection;
