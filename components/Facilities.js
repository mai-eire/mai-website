import React from 'react';
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
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShareIcon from '@mui/icons-material/Share';
import SchoolIcon from '@mui/icons-material/School';

const Facilities = () => {
  const facilities = [
    {
      title: 'Tallaght Mosque',
      description: 'Join us for the five daily prayers in our peaceful prayer halls. Our facilities are designed to accommodate both brothers and sisters in separate, comfortable spaces.',
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Albayan School',
      description: 'Albayan School is a weekend Arabic and Quran school dedicated to teaching the Arabic language and Quranic studies to students of all ages in a nurturing Islamic environment.',
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'LC Arabic Classes',
      description: 'Specialized Arabic classes designed to prepare students for the Irish Leaving Certificate examination. Our program helps students excel in their Arabic language studies through comprehensive curriculum coverage and exam preparation.',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: '5 Daily Prayers',
      description: 'Join us for the five daily prayers in our peaceful prayer halls. Our facilities are designed to accommodate both brothers and sisters in separate, comfortable spaces.',
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Friday (Jumuaa) Prayer',
      description: 'Join us every Friday at 1:15 PM for the Jumuaa prayer with an inspiring khutbah (sermon).',
      icon: <MosqueIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Dawah Department',
      description: 'Our Dawah Department is dedicated to sharing the message of Islam with the wider community through educational programs, interfaith dialogues, and community outreach initiatives.',
      icon: <ShareIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Scouts',
      description: 'Our scout program helps young Muslims develop leadership skills, build character, and engage in outdoor activities while maintaining Islamic values.',
      icon: <EmojiPeopleIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Youth Department',
      description: 'A dedicated space for young Muslims to connect, learn, and grow together through educational programs, social activities, and community service.',
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            mb: { xs: 4, md: 6 },
            color: 'text.primary',
          }}
        >
          Our Facilities
        </Typography>
        
        <Typography
          variant="h6"
          align="center"
          sx={{
            mb: { xs: 5, md: 7 },
            color: 'text.secondary',
            maxWidth: 800,
            mx: 'auto',
            lineHeight: 1.7,
          }}
        >
          MAI provides a range of facilities and services to serve our community's spiritual, educational, and social needs.
        </Typography>

        <Grid container spacing={4}>
          {facilities.map((facility, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
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