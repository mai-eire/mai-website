import React from 'react';
import { Box } from '@mui/material';
import HeroSection from './landing/HeroSection';
import NewsletterSection from './landing/NewsletterSection';
import FeaturesSection from './landing/FeaturesSection';
import AppDownloadSection from './landing/AppDownloadSection';
import CallToActionSection from './landing/CallToActionSection';
import FooterSection from './landing/FooterSection';

const LandingPage = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <HeroSection />
      <FeaturesSection />
      <AppDownloadSection />
      <CallToActionSection />
      <NewsletterSection />
    </Box>
  );
};

export default LandingPage; 