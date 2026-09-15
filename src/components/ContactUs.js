import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
  Chip,
  Card,
  CardContent,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import {
  DEPARTMENTS,
  DEFAULT_DEPARTMENT_ID,
  getDepartment,
} from '../../data/departments';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: 12,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const emptyForm = {
  name: '',
  email: '',
  category: '',
  subject: '',
  message: '',
};

const ContactUs = () => {
  const router = useRouter();
  const [departmentId, setDepartmentId] = useState(DEFAULT_DEPARTMENT_ID);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const department = getDepartment(departmentId) || DEPARTMENTS[0];

  // Allow deep links such as /contact?department=youth to open the right department.
  useEffect(() => {
    if (!router.isReady) return;
    const requested = router.query.department;
    if (typeof requested === 'string' && getDepartment(requested)) {
      setDepartmentId(requested);
    }
  }, [router.isReady, router.query.department]);

  const handleDepartmentChange = (nextId) => {
    if (nextId === department.id) return;
    setDepartmentId(nextId);
    // Category lists differ per department; keep everything else typed so far.
    setFormData((prev) => ({ ...prev, category: '' }));
    router.replace(
      { pathname: router.pathname, query: { department: nextId } },
      undefined,
      { shallow: true, scroll: false }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, department: department.id }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setSnackbar({
          open: true,
          message: `Thank you for your message! The ${department.label} team will get back to you soon.`,
          severity: 'success',
        });
        setFormData(emptyForm);
      } else {
        setSnackbar({
          open: true,
          message: data.error || 'Something went wrong. Please try again.',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Something went wrong. Please try again later.',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Contact Us
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Have questions? Pick the team you'd like to reach and send us a message.
          We'll respond as soon as possible.
        </Typography>

        <Box
          role="group"
          aria-label="Choose a department to contact"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1.5,
          }}
        >
          {DEPARTMENTS.map((dept) => {
            const selected = dept.id === department.id;
            return (
              <Chip
                key={dept.id}
                label={dept.label}
                clickable
                color="primary"
                variant={selected ? 'filled' : 'outlined'}
                aria-pressed={selected}
                onClick={() => handleDepartmentChange(dept.id)}
                sx={{ px: 1, fontSize: '0.95rem', height: 40 }}
              />
            );
          })}
        </Box>

        <StyledPaper>
          <Typography variant="h5" component="h2" gutterBottom>
            Contact {department.label}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {department.intro}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  required
                  fullWidth
                  label="What is this about?"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  variant="outlined"
                >
                  {department.categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={submitting}
                  startIcon={
                    submitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {submitting ? 'Sending...' : `Send to ${department.label}`}
                </Button>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>

        <Box component="section" sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Departments
          </Typography>
          <Typography
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Prefer to email directly? Here's who to reach.
          </Typography>
          <Grid container spacing={3}>
            {DEPARTMENTS.map((dept) => (
              <Grid item xs={12} sm={6} md={4} key={dept.id}>
                <Card
                  variant="outlined"
                  sx={{ height: '100%', borderRadius: 3 }}
                >
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {dept.label}
                    </Typography>
                    {dept.head && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2">{dept.head}</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Link
                        href={`mailto:${dept.email}`}
                        variant="body2"
                        underline="hover"
                      >
                        {dept.email}
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ContactUs;
