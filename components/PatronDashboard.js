import React, { useState } from 'react';
import { Box, Grid, Typography, LinearProgress, Paper, Button, Snackbar } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { PRODUCTS } from '@/config/stripe';
import StripePayment from './StripePayment';

// Dummy data for bills
const initialBills = [
  {
    id: 1,
    title: 'Water (Affinity Water) Bill',
    amount: 93.00,
    coveragePercent: 100,
    icon: <WaterDropIcon />,
    description: 'Cover the cost of MAI\'s water bill and get rewarded everytime someone makes wudu in the mosque, each time food is clean and served, and whenever bathroom is used in one of Allah\'s houses.',
    donorsNeeded: 1,
    currentDonors: 1,
    stripeProductId: PRODUCTS.WATER_BILL
  },
  {
    id: 2,
    title: 'Internet (Virgin Media) Bill',
    amount: 64.00,
    coveragePercent: 100,
    icon: <WifiIcon />,
    description: 'MAI offers free WiFi to its visitors. By covering the internet bill you will inshaAllah be rewarded each time someone uses the WiFi to learn Islamic knowledge, study for exams in our café, and for Islamic classes!',
    donorsNeeded: 1,
    currentDonors: 1,
    stripeProductId: PRODUCTS.INTERNET_BILL
  },
  {
    id: 3,
    title: 'Gas Bill',
    amount: 140.00,
    coveragePercent: 0,
    icon: <LocalGasStationIcon />,
    description: 'Help keep the mosque warm during winter and support the heating system that makes our space comfortable for worship and learning.',
    donorsNeeded: 2,
    currentDonors: 0,
    stripeProductId: PRODUCTS.GAS_BILL
  },
  {
    id: 4,
    title: 'Electricity Bill',
    amount: 175.00,
    coveragePercent: 0,
    icon: <ElectricBoltIcon />,
    description: 'Support the mosque\'s lighting and electrical needs, enabling activities and prayers throughout the day and night.',
    donorsNeeded: 3,
    currentDonors: 0,
    stripeProductId: PRODUCTS.ELECTRICITY_BILL
  }
];

const PatronDashboard = () => {
  const [bills, setBills] = useState(initialBills);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Calculate total coverage percentage
  const totalCoverage = bills.reduce((acc, bill) => acc + bill.coveragePercent, 0) / bills.length;

  const handleSuccess = (billId) => {
    // Update bill coverage
    setBills(currentBills => {
      return currentBills.map(b => {
        if (b.id === billId && b.currentDonors < b.donorsNeeded) {
          const newDonors = b.currentDonors + 1;
          const newCoveragePercent = (newDonors / b.donorsNeeded) * 100;
          return {
            ...b,
            currentDonors: newDonors,
            coveragePercent: newCoveragePercent
          };
        }
        return b;
      });
    });
    setSnackbar({
      open: true,
      message: 'Thank you for becoming a patron!',
      severity: 'success'
    });
  };

  const handleError = (error) => {
    setSnackbar({
      open: true,
      message: 'Payment failed. Please try again.',
      severity: 'error'
    });
    console.error('Payment error:', error);
  };

  return (
    <Box sx={{ 
      maxWidth: 'lg',
      mx: 'auto',
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 3, sm: 4, md: 5 },
    }}>
      {/* Total Coverage Section */}
      <Paper 
        elevation={3}
        sx={{ 
          p: { xs: 3, sm: 4 },
          mb: { xs: 4, sm: 5 },
          bgcolor: '#1a1a1a',
          color: '#ffffff',
          borderRadius: 3,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(46, 125, 50, 0.1), rgba(46, 125, 50, 0.2))',
            borderRadius: 3,
            pointerEvents: 'none',
          }
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#ffffff', mb: 2 }}>
          MAI Total Coverage
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.9)' }}>
          This shows the proportion of ongoing bills covered by donors. Currently {totalCoverage.toFixed(1)}% of MAI running costs are covered
          meaning {(100 - totalCoverage).toFixed(1)}% remain uncovered.
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={totalCoverage} 
          sx={{ 
            height: 12,
            borderRadius: 6,
            backgroundColor: 'rgba(255,255,255,0.2)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#4caf50'
            }
          }} 
        />
        <Typography variant="body2" sx={{ mt: 2, color: '#ffffff', fontWeight: 500 }}>
          {totalCoverage.toFixed(1)}% coverage
        </Typography>
      </Paper>

      {/* Bills Grid */}
      <Grid container spacing={4}>
        {bills.map((bill) => (
          <Grid item xs={12} key={bill.id}>
            <Paper 
              elevation={2}
              sx={{ 
                p: { xs: 3, sm: 4 },
                borderRadius: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <Box sx={{ 
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    borderRadius: '50%',
                    bgcolor: 'rgba(46, 125, 50, 0.1)',
                    p: 2
                  }}>
                    {bill.icon}
                  </Box>
                </Grid>
                <Grid item xs>
                  <Typography variant="h6" sx={{ 
                    color: 'text.primary', 
                    fontWeight: 600,
                    mb: 1,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    {bill.title} - €{bill.amount.toFixed(2)}/month
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 2 }}
                  >
                    {bill.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={bill.coveragePercent} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        mb: 1.5,
                        backgroundColor: 'rgba(46, 125, 50, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'primary.main'
                        }
                      }} 
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {bill.currentDonors}/{bill.donorsNeeded} donor{bill.donorsNeeded > 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item sx={{ pl: { xs: 0, sm: 2 } }}>
                  {bill.coveragePercent === 100 ? (
                    <Button 
                      variant="contained" 
                      disabled 
                      sx={{
                        bgcolor: 'rgba(46, 125, 50, 0.1)',
                        color: 'text.secondary',
                        px: 3,
                        py: 1.5,
                        minWidth: { xs: '100%', sm: 'auto' }
                      }}
                    >
                      Bill covered
                    </Button>
                  ) : (
                    <StripePayment
                      productId={bill.stripeProductId}
                      amount={bill.amount}
                      onSuccess={() => handleSuccess(bill.id)}
                      onError={handleError}
                    >
                      Become a patron
                    </StripePayment>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        sx={{
          bottom: { xs: 16, sm: 24 }
        }}
      />
    </Box>
  );
};

export default PatronDashboard; 