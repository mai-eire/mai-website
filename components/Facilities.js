import React from 'react';
import Image from 'next/image';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import MosqueIcon from '@mui/icons-material/Mosque';
import GroupsIcon from '@mui/icons-material/Groups';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShareIcon from '@mui/icons-material/Share';
import SchoolIcon from '@mui/icons-material/School';
import SportsMmaIcon from '@mui/icons-material/SportsMma';

const Facilities = () => {
  const facilities = [
    {
      title: 'Tallaght Muslim Center',
      description: 'Join us for the five daily prayers in our peaceful prayer halls. Our facilities are designed to accommodate both brothers and sisters in separate, comfortable spaces.',
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Albayan School',
      description: 'Albayan School is a weekend Arabic and Quran school dedicated to teaching the Arabic language and Quranic studies to students of all ages in a nurturing Islamic environment.',
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Youth Department',
      description: 'A dedicated space for young Muslims to connect, learn, and grow together through educational programs, social activities, and community service.',
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: '5 Daily Prayers',
      description: 'Join us for the five daily prayers in our peaceful prayer halls. Our facilities are designed to accommodate both brothers and sisters in separate, comfortable spaces.',
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Friday (Jumuaa) Prayer',
      description: 'Join us every Friday at 1pm or 2pm for the Jumuaa prayers with an inspiring khutbah (sermon).',
      icon: <MosqueIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Dawah Department',
      description: 'Our Dawah Department is dedicated to sharing the message of Islam with the wider community through educational programs, interfaith dialogues, and community outreach initiatives.',
      icon: <ShareIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: "Women's Activities",
      description: 'Weekly gatherings for sisters with spiritual, social and intercultural events. Sisters of all ages and backgrounds are warmly invited to join, volunteer, and help shape our activities.',
      icon: <Diversity3Icon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'LC Arabic Classes',
      description: 'Specialized Arabic classes designed to prepare students for the Irish Leaving Certificate examination. Our program helps students excel in their Arabic language studies through comprehensive curriculum coverage and exam preparation.',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Sports Center & MMA Gym',
      description: 'Strong Body, Strong Mind. Our sports center offers martial arts and fitness training for all ages and levels. We offer: Karate, MMA, Boxing, Wrestling, and Women\'s Fitness classes.',
      icon: <SportsMmaIcon sx={{ fontSize: 40 }} />,
    }
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 6, md: 8 },
        backgroundColor: 'background.default',
      }}
    >
      {/* Prayer hall photograph, washed back so the cards stay the focus */}
      <Box aria-hidden sx={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/assets/tallaght_mosque.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={70}
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
      </Box>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(247, 250, 252, 0.6) 0%, rgba(247, 250, 252, 0.5) 25%, rgba(247, 250, 252, 0.5) 75%, rgba(247, 250, 252, 0.92) 100%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        {/* Intro sits on the same frosted surface as the cards so it has something to rest on */}
        <Box
          sx={{
            maxWidth: 880,
            mx: 'auto',
            mb: { xs: 5, md: 7 },
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 5 },
            textAlign: 'center',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              mb: { xs: 2, md: 3 },
              color: 'text.primary',
            }}
          >
            Our Facilities
          </Typography>

          <Box
            aria-hidden
            sx={{ width: 56, height: 3, mx: 'auto', mb: { xs: 2, md: 3 }, bgcolor: 'primary.main', borderRadius: 2 }}
          />

          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.7,
            }}
          >
            MAI provides a range of facilities and services to serve our community's spiritual, educational, and social needs.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {facilities.map((facility, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  // Frosted glass, so the prayer hall shows through the cards as well as around them
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'primary.main',
                      borderRadius: '50%',
                      p: 2,
                      mb: 3,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {facility.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {facility.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                    }}
                  >
                    {facility.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Facilities; 