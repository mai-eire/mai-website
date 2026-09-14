import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MosqueIcon from '@mui/icons-material/Mosque';
import GroupsIcon from '@mui/icons-material/Groups';
import FavoriteIcon from '@mui/icons-material/Favorite';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  width: 64,
  height: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
  color: theme.palette.primary.contrastText,
}));

const FeaturesSection = () => {
  const features = [
    {
      icon: <MosqueIcon fontSize="large" />,
      title: 'Support Our Mosque',
      description: 'Help maintain and improve our community space through regular contributions.',
    },
    {
      icon: <GroupsIcon fontSize="large" />,
      title: 'Join Our Community',
      description: 'Become part of a network of dedicated supporters who make a difference.',
    },
    {
      icon: <FavoriteIcon fontSize="large" />,
      title: 'Make an Impact',
      description: 'Your support directly contributes to the growth and sustainability of our mosque.',
    },
  ];

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item key={index} xs={12} md={4}>
            <StyledCard elevation={2}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeaturesSection; 