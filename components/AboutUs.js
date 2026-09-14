import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const AboutUs = () => {
  const objectives = [
    "To spread the awareness of Islam and its values, and also to explain the Islamic culture according to the needs of current time and the European context.",
    "To support Muslims in Ireland to practice their religious duties, preserve their cultural identity and promote their social interests.",
    "To give due importance to the children of Muslim community through the provision of opportunities to teach them Islamic religion, Arabic language, and supporting them towards higher educational and career achievements.",
    "To work toward realising the presence and representation of Muslims in Ireland.",
    "To build up the bridges and coordinate with other Islamic, Irish, and European organisations to achieve better future of Ireland.",
    "To participate in the efforts to protect the liberties and defend the rights, honour and safety of human beings.",
    "To contribute towards efforts which aim to protect freedom and human rights.",
  ];

  // Shared card styling for consistency across the page
  const cardSx = {
    p: { xs: 3, md: 4 },
    height: '100%',
    bgcolor: 'background.paper',
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'rgba(0, 0, 0, 0.08)',
  };

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontFamily: 'Lora',
              fontWeight: 400,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            About MAI
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              maxWidth: '760px',
              mx: 'auto',
              lineHeight: 1.7,
              fontSize: { xs: '1.1rem', md: '1.35rem' },
            }}
          >
            A religious, educational and social non-profit organisation serving
            the Muslim community across Ireland since 2000.
          </Typography>
        </Box>

        {/* Introduction */}
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            p: { xs: 3, md: 5 },
            mb: { xs: 4, md: 6 },
            borderLeft: 4,
            borderLeftColor: 'primary.main',
          }}
        >
          <Typography
            sx={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'text.secondary' }}
          >
            MAI is a religious, educational, social and non-profit organisation
            formed in 2000 as the number of Muslims in Ireland grew. We provide
            religious, educational and social services and programs designed to
            support the comprehensive educational and spiritual development of the
            Muslim individual, family and community.
          </Typography>
        </Paper>

        {/* Vision & Mission */}
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={cardSx}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: 'rgba(46, 125, 50, 0.1)',
                  color: 'primary.main',
                  mb: 2.5,
                }}
              >
                <VisibilityOutlinedIcon sx={{ fontSize: 30 }} />
              </Box>
              <Typography
                variant="h4"
                sx={{ mb: 2, fontFamily: 'Lora', fontWeight: 500 }}
              >
                Our Vision
              </Typography>
              <Typography
                sx={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'text.secondary' }}
              >
                The preservation of the Islamic identity in Ireland, introducing
                Islam and its humanitarian values, and encouraging positive and
                effective participation in Irish society.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                ...cardSx,
                bgcolor: 'primary.main',
                borderColor: 'primary.main',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <FormatQuoteIcon sx={{ fontSize: 44, opacity: 0.5, mb: 1 }} />
              <Typography
                sx={{
                  fontSize: '1.15rem',
                  lineHeight: 1.8,
                  fontStyle: 'italic',
                  mb: 2,
                }}
              >
                "O mankind, indeed We have created you from male and female and
                made you peoples and tribes that you may know one another. Indeed,
                the most noble of you in the sight of Allah is the most righteous
                of you. Indeed, Allah is Knowing and Acquainted."
              </Typography>
              <Typography
                sx={{ mt: 'auto', opacity: 0.85, fontSize: '0.95rem', fontWeight: 500 }}
              >
                Sūrat al-Ḥujurāt (49) — The Holy Quran
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Objectives */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ mb: { xs: 3, md: 5 }, fontFamily: 'Lora', fontWeight: 400 }}
          >
            Our Objectives
          </Typography>
          <Grid container spacing={3}>
            {objectives.map((objective, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    ...cardSx,
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography
                    sx={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'text.secondary' }}
                  >
                    {objective}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Why Section */}
        <Box>
          <Typography
            variant="h4"
            align="center"
            sx={{ mb: { xs: 3, md: 5 }, fontFamily: 'Lora', fontWeight: 400 }}
          >
            Why MAI?
          </Typography>
          <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, md: 5 } }}>
            <Typography
              sx={{
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: 'text.secondary',
                mb: 3,
              }}
            >
              The last decade witnessed a significant increase in the Muslim
              population in Ireland. This growth called for more establishments to
              help existing Islamic organizations meet the new needs of the
              community.
            </Typography>
            <Typography
              sx={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'text.secondary' }}
            >
              MAI is an educational and social organisation established in February
              2000 to help Muslims in Ireland build a better future, and to
              introduce Islam and its cultural values to the Irish public.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs;
