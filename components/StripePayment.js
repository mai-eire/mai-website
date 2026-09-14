import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button, CircularProgress } from '@mui/material';
import { STRIPE_PUBLIC_KEY } from '../config/stripe';

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const StripePayment = ({ productId, amount, onSuccess, onError, children }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // In development, simulate a successful payment
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        onSuccess();
        return;
      }

      const stripe = await stripePromise;
      
      // Create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          amount,
        }),
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        onError(result.error);
      }
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handlePayment}
      disabled={loading}
      startIcon={loading && <CircularProgress size={20} color="inherit" />}
    >
      {children}
    </Button>
  );
};

export default StripePayment; 