import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import Image from 'next/image';

const AppDownloadSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      py: { xs: 4, md: 8 }, 
      pt: { xs: 4, md: 12 },  // Increased top padding for desktop view
      bgcolor: 'background.default' 
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  fontSize: { xs: '1.75rem', md: '2.125rem' }
                }}
              >
                Download MAI Prayers App
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                Get prayer times, news updates, and stay connected with MAI.
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: { xs: 2, md: 3 }, 
                  mb: { xs: 3, md: 4 }, 
                  flexWrap: 'wrap', 
                  alignItems: 'center',
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}
              >
                <Box
                  component="a"
                  href="https://play.google.com/store/apps/details?id=com.mai_adan_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-block',
                    height: { xs: 40, md: 48 },
                    '& img': {
                      height: '100%',
                      width: 'auto'
                    },
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                >
                  <Image
                    src="/assets/GetItOnGooglePlay_Badge_Web_color_English.png"
                    alt="Get it on Google Play"
                    width={isMobile ? 135 : 162}
                    height={isMobile ? 40 : 48}
                    style={{ cursor: 'pointer' }}
                  />
                </Box>
                <Box
                  component="a"
                  href="https://apps.apple.com/us/app/mai-prayers-tallaght-mosque/id6446219395"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-block',
                    height: { xs: 40, md: 48 },
                    '& img': {
                      height: '100%',
                      width: 'auto'
                    },
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                >
                  <Image
                    src="/assets/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg"
                    alt="Download on the App Store"
                    width={isMobile ? 135 : 162}
                    height={isMobile ? 40 : 48}
                    style={{ cursor: 'pointer' }}
                  />
                </Box>
              </Box>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 2, md: 2 }, 
                  bgcolor: 'rgba(46, 125, 50, 0.1)', 
                  borderRadius: 2,
                  textAlign: { xs: 'center', md: 'left' },
                  mb: { xs: 6, md: 0 }
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  <PhoneAndroidIcon color="primary" />
                  Features include prayer times, iqama times, news updates, and mosque information
                </Typography>
              </Paper>
            </Box>
          </Grid>
          
          {/* App Screenshot */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: { xs: 280, md: 600 },
                aspectRatio: { xs: '0.8/1', md: '1/1' },
                mx: 'auto',
                mt: { xs: 2, md: 0 },
                mb: { xs: 4, md: 0 },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 4,
                  background: 'rgba(46, 125, 50, 0.1)',
                  zIndex: 0,
                }
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: '80%', md: '65%' },
                  zIndex: 1,
                }}
              >
                <Image
                  src="/assets/app-screenshot.jpeg"
                  alt="MAI Prayers App Screenshot"
                  width={300}
                  height={600}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: 16,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }}
                  priority
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AppDownloadSection; 