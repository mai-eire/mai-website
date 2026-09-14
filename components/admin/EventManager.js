import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { EVENT_CATEGORIES } from '../../data/events';
import { useRouter } from 'next/router';

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

const EventManager = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    description: '',
    category: 'GENERAL',
    location: '',
    isActive: true,
  });

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load events',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenDialog = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        ...event,
        startTime: format(new Date(event.startTime), "yyyy-MM-dd'T'HH:mm"),
        endTime: event.endTime ? format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm") : '',
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        title: '',
        startTime: '',
        endTime: '',
        description: '',
        category: 'GENERAL',
        location: '',
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (formData.endTime && new Date(formData.endTime) <= new Date(formData.startTime)) {
      newErrors.endTime = 'End time must be after start time';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fix the form errors',
        severity: 'error'
      });
      return;
    }

    try {
      const url = selectedEvent 
        ? `/api/events/${selectedEvent.id}`
        : '/api/events';
      
      const method = selectedEvent ? 'PUT' : 'POST';
      
      // Format dates to ISO string for the API
      const submitData = {
        ...formData,
        date: new Date(formData.startTime).toISOString(), // Use startTime as the event date
        startTime: new Date(formData.startTime).toISOString(),
        endTime: formData.endTime ? new Date(formData.endTime).toISOString() : null,
      };
      
      console.log('Submitting data:', submitData); // Debug log
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to save event');
      }

      const data = await response.json();
      console.log('Success response:', data); // Debug log

      setSnackbar({
        open: true,
        message: `Event ${selectedEvent ? 'updated' : 'created'} successfully`,
        severity: 'success'
      });

      handleCloseDialog();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save event',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete event');

        setSnackbar({
          open: true,
          message: 'Event deleted successfully',
          severity: 'success'
        });

        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete event',
          severity: 'error'
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthToken');
    router.push('/admin/login');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography 
              variant="h2" 
              sx={{ 
                fontFamily: 'Lora',
                fontWeight: 400,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Event Manager
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                Add New Event
              </Button>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  }
                }}
              >
                Logout
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Events Table */}
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>
                    {format(new Date(event.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getCategoryLabel(event.category)}
                      size="small"
                      sx={{ 
                        bgcolor: `${getCategoryColor(event.category)}15`,
                        color: getCategoryColor(event.category),
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <Chip 
                      label={event.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={event.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog(event)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(event.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Event Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ fontFamily: 'Lora' }}>
            {selectedEvent ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startTime}
                  helperText={errors.startTime}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endTime}
                  helperText={errors.endTime}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  error={!!errors.category}
                  helperText={errors.category}
                  required
                >
                  <MenuItem value="GENERAL">General</MenuItem>
                  <MenuItem value="EDUCATIONAL">Educational</MenuItem>
                  <MenuItem value="YOUTH">Youth</MenuItem>
                  <MenuItem value="COMMUNITY">Community</MenuItem>
                  <MenuItem value="RELIGIOUS">Religious</MenuItem>
                  <MenuItem value="CHARITY">Charity</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  error={!!errors.location}
                  helperText={errors.location}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      name="isActive"
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              variant="contained"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              {selectedEvent ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default EventManager; 