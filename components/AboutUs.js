import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Divider
} from '@mui/material';

const AboutUs = () => {
  const objectives = [
    "To spread the awareness of Islam and its values, and also to explain the Islamic culture according to the needs of current time and the European context.",
    "To support Muslims in Ireland to practice their religious duties, preserve their cultural identity and promote their social interests.",
    "To give due importance to the children of Muslim community through the provision of opportunities to teach them Islamic religion, Arabic language, and supporting them towards higher educational and career achievements.",
    "To work toward realising the presence and representation of Muslims in Ireland.",
    "To build up the bridges and coordinate with other Islamic, Irish, and European organisations to achieve better future of Ireland.",
    "To participate in the efforts to protect the liberties and defend the rights, honour and safety of human beings.",
    "To Contributing towards efforts, which aim to protect freedom and human rights."
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1"
            sx={{ 
              fontFamily: 'Lora',
              fontWeight: 400,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            About MAI
          </Typography>
          <Typography 
            variant="h5"
            sx={{ 
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              fontFamily: 'Source Sans Pro'
            }}
          >
            Welcome to the Muslim Association of Ireland's (MAI) website
          </Typography>
        </Box>

        {/* Main Content */}
        <Grid container spacing={6}>
          {/* Introduction */}
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 3, md: 5 },
                bgcolor: 'background.paper',
                borderRadius: 2
              }}
            >
              <Typography 
                sx={{ 
                  fontSize: '1.125rem',
                  lineHeight: 1.8,
                  color: 'text.secondary'
                }}
              >
                The Muslim Association of Ireland (MAI) is a religious, educational, social and non-profit organization was formed in 2000 as the numbers of Muslims have increased. MAI provides religious and educational social services and programs designed to assist in the comprehensive educational and spiritual development of the Muslim individual, family and community.
              </Typography>
            </Paper>
          </Grid>

          {/* Vision & Mission */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 3,
                  fontFamily: 'Lora',
                  fontWeight: 400
                }}
              >
                Our Vision
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: '1.125rem',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  mb: 4
                }}
              >
                The preservation of the islamic identity in Ireland and intrduce Islam and its humanitairan valules and encourage the positive and effective participation in Irish Society.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 3,
                  fontFamily: 'Lora',
                  fontWeight: 400
                }}
              >
                Our Mission
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: '1.125rem',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  mb: 2
                }}
              >
                "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allah is the most righteous of you. Indeed, Allah is Knowing and Acquainted"
              </Typography>
              <Typography 
                sx={{ 
                  color: 'text.secondary',
                  fontFamily: 'Source Sans Pro'
                }}
              >
                Chapter (49) sūrat l-ḥujurāt (The Dwellings) Holy Quran
              </Typography>
            </Box>
          </Grid>

          {/* Objectives */}
          <Grid item xs={12}>
            <Box sx={{ mt: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 4,
                  fontFamily: 'Lora',
                  fontWeight: 400
                }}
              >
                Our Objectives
              </Typography>
              <Grid container spacing={3}>
                {objectives.map((objective, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 3,
                        bgcolor: 'background.paper',
                        borderLeft: 4,
                        borderColor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'rgba(46, 125, 50, 0.04)'
                        }
                      }}
                    >
                      <Typography 
                        sx={{ 
                          fontSize: '1.125rem',
                          lineHeight: 1.8,
                          color: 'text.secondary'
                        }}
                      >
                        {objective}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Why Section */}
          <Grid item xs={12}>
            <Box sx={{ mt: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 4,
                  fontFamily: 'Lora',
                  fontWeight: 400
                }}
              >
                Why?
              </Typography>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 3, md: 5 },
                  bgcolor: 'background.paper',
                  borderRadius: 2
                }}
              >
                <Typography 
                  sx={{ 
                    fontSize: '1.125rem',
                    lineHeight: 1.8,
                    color: 'text.secondary',
                    mb: 3
                  }}
                >
                  The last decade witnessed a significant increase in Muslim population in Ireland. This increase required more establishments to help the existing Islamic organizations in fulfilling the new needs of the community.
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: '1.125rem',
                    lineHeight: 1.8,
                    color: 'text.secondary'
                  }}
                >
                  MAI is an educational and social organisation established in February 2000 to help Muslim in Ireland obtaining better future and also to introduce Islam and its cultural values to the Irish public.
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs; 