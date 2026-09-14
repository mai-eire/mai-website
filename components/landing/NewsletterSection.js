import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  InputAdornment
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

const NewsletterSection = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        py: { xs: 8, md: 12 },
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'rgba(0, 0, 0, 0.12)',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Lora',
              fontWeight: 400,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Stay Connected
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Subscribe to our newsletter to receive updates about mosque activities, events, and community news.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            bgcolor: 'rgba(46, 125, 50, 0.04)',
            borderRadius: 2,
            maxWidth: '500px',
            mx: 'auto'
          }}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  placeholder="Enter your email address"
                  variant="outlined"
                  type="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }}
                >
                  Subscribe
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}
          >
            By subscribing, you agree to receive email communications from MAI.
            <br />
            We respect your privacy and will never share your information.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default NewsletterSection; 