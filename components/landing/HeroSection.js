import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Divider,
  Grid
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <Container 
        maxWidth="lg" 
        sx={{ 
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Grid 
          container 
          spacing={4} 
          sx={{ 
            py: { xs: 4, md: 8 }
          }}
        >
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: 560, mx: 'auto' }}>
              {/* Location */}
              <Box sx={{ mb: 4 }}>
                <Stack 
                  direction="row" 
                  spacing={1} 
                  alignItems="center"
                  divider={<Divider orientation="vertical" flexItem sx={{ bgcolor: 'text.primary' }} />}
                >
                  <Box sx={{ width: 32 }} />
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      fontFamily: 'Source Sans Pro',
                      fontWeight: 400
                    }}
                  >
                    TALLAGHT, DUBLIN
                  </Typography>
                </Stack>
              </Box>

              {/* Main Heading */}
              <Typography 
                component="h1" 
                sx={{
                  fontFamily: 'Lora',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  mb: 3,
                  fontWeight: 400
                }}
              >
                MAI Muslim Center
              </Typography>

              {/* Description */}
              <Typography 
                sx={{ 
                  mb: 4,
                  color: 'text.secondary',
                  fontSize: '1.125rem',
                  maxWidth: '90%',
                  lineHeight: 1.6
                }}
              >
                A mosque of the future, rooted in prophetic tradition, where people of all backgrounds seek Allah's pleasure alone, moving forward as one united ummah for the sake of Allah.
              </Typography>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  component="a"
                  href="https://donate.stripe.com/4gw17p7F05CM3dKeV0"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 0,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }}
                >
                  Donate
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PlaceIcon sx={{ color: 'primary.main' }} />}
                  href="https://www.google.com/maps/search/?api=1&query=Tallaght+Mosque,+Greenhills+Rd,+Tymon+North,+Dublin"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    borderRadius: 0,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      bgcolor: 'transparent',
                      opacity: 0.7
                    }
                  }}
                >
                  Find Us
                </Button>
              </Stack>

              {/* Social Media */}
              <Box sx={{ mt: 6 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontWeight: 400
                  }}
                >
                  FOLLOW US ON SOCIAL MEDIA
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="text"
                    href="https://www.instagram.com/mai_youth/"
                    sx={{
                      minWidth: 'auto',
                      p: 0,
                      color: 'black',
                      '&:hover': {
                        bgcolor: 'transparent',
                        opacity: 0.7
                      }
                    }}
                  >
                    Instagram
                  </Button>
                  <Button
                    variant="text"
                    href="https://www.facebook.com/people/Irish-MAI-Endowment/100064844792099/"
                    sx={{
                      minWidth: 'auto',
                      p: 0,
                      color: 'black',
                      '&:hover': {
                        bgcolor: 'transparent',
                        opacity: 0.7
                      }
                    }}
                  >
                    Facebook
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Grid>

          {/* Right Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: '300px', md: '75vh' },
                width: '100%',
                overflow: 'hidden'
              }}
            >
              <Image
                src="/assets/tallaght_mosque.jpg"
                alt="Mosque Interior"
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                priority
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection; 