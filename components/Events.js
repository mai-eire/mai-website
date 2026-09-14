import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { EVENT_CATEGORIES } from '@/data/events';

// Function to get category color
const getCategoryColor = (categoryId) => {
  // Handle case-insensitive matching
  const category = EVENT_CATEGORIES.find(cat => 
    cat.id.toLowerCase() === (categoryId || '').toLowerCase()
  );
  return category ? category.color : '#757575'; // Default gray if category not found
};

// Function to get category label
const getCategoryLabel = (categoryId) => {
  // Handle case-insensitive matching
  const category = EVENT_CATEGORIES.find(cat => 
    cat.id.toLowerCase() === (categoryId || '').toLowerCase()
  );
  return category ? category.label : categoryId || 'Unknown';
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events');
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        console.log('Events from API:', data);
        console.log('Categories from API:', data.map(event => event.category));
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (event.category && event.category.toLowerCase() === selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory && event.isActive;
  });

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Header */}
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
            Upcoming Events
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
            Join us for our regular programs and special events
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                variant="outlined"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {EVENT_CATEGORIES.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>

        {/* Events Grid */}
        <Grid container spacing={3}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} key={event.id}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box mb={2}>
                    <Chip 
                      label={getCategoryLabel(event.category)}
                      sx={{ 
                        bgcolor: `${getCategoryColor(event.category)}15`,
                        color: getCategoryColor(event.category),
                        fontWeight: 500
                      }}
                    />
                  </Box>

                  <Typography 
                    variant="h5"
                    sx={{ 
                      fontFamily: 'Lora',
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    {event.title}
                  </Typography>

                  <Typography 
                    variant="body1"
                    color="text.secondary" 
                    sx={{ mb: 3 }}
                  >
                    {event.description}
                  </Typography>

                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(event.date), 'EEEE, MMMM d, yyyy')} at {format(new Date(event.startTime), 'h:mm a')}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOnIcon sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No events found matching your criteria
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Events; 