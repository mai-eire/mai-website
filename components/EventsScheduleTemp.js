import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';

// TEMPORARY: displays the gym schedule image in place of the events listing
// while the events endpoint is unavailable. To restore the real events page,
// point pages/events.tsx back to `../components/Events`.
const EventsScheduleTemp = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontFamily: 'Lora',
              fontWeight: 400,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Class Schedule
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              fontFamily: 'Source Sans Pro',
            }}
          >
            Join us for our weekly sports and fitness classes
          </Typography>
        </Box>

        {/* Schedule Image */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Image
            src="/assets/gym-schedule.jpeg"
            alt="Gym class schedule"
            width={1564}
            height={1550}
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default EventsScheduleTemp;
