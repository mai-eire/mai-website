import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'About Us', path: '/about' },
    { label: 'Events', path: '/events' },
    // { label: 'Gallery', path: '/gallery' },
    { label: 'Facilities', path: '/facilities' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Image
          src="/assets/MAI LOGO.png"
          alt="MAI Logo"
          width={80}
          height={80}
          priority
        />
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} component={Link} href={item.path} sx={{ 
            textAlign: 'center',
            '&:hover': {
              backgroundColor: 'rgba(46, 125, 50, 0.08)',
            }
          }}>
            <ListItemText 
              primary={item.label}
              sx={{
                '& .MuiTypography-root': {
                  color: 'text.primary',
                  fontWeight: 500,
                }
              }}
            />
          </ListItem>
        ))}
        <ListItem 
          component={Link} 
          href="/dashboard"
          sx={{ 
            textAlign: 'center',
            mt: 2,
            '&:hover': {
              backgroundColor: 'rgba(46, 125, 50, 0.08)',
            }
          }}
        >
          <ListItemText 
            primary="Become a MAI Patron"
            sx={{
              '& .MuiTypography-root': {
                color: 'primary.main',
                fontWeight: 600,
              }
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.12)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2, md: 3 } }}>
            {/* Logo */}
            <Link href="/" passHref style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  opacity: 0.85,
                  transform: 'scale(1.02)'
                },
              }}>
                <Image
                  src="/assets/MAI LOGO.png"
                  alt="MAI Logo"
                  width={80}
                  height={80}
                  priority
                />
              </Box>
            </Link>

            {/* Mobile Menu Button */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Link href="/dashboard" passHref style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: '50px',
                      px: 2,
                      borderWidth: 2,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      '&:hover': {
                        borderWidth: 2,
                      }
                    }}
                  >
                    Become a Patron
                  </Button>
                </Link>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(46, 125, 50, 0.08)',
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}

            {/* Desktop Navigation Items */}
            {!isMobile && (
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' },
                gap: 2,
                alignItems: 'center'
              }}>
                {navItems.map((item) => (
                  <Link key={item.label} href={item.path} passHref style={{ textDecoration: 'none' }}>
                    <Button
                      sx={{
                        color: 'text.primary',
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: 'primary.main',
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <Link href="/dashboard" passHref style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    sx={{
                      ml: 2,
                      borderRadius: '50px',
                      px: 3,
                      borderWidth: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      '&:hover': {
                        borderWidth: 2,
                      }
                    }}
                  >
                    Become a MAI Patron
                  </Button>
                </Link>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            backgroundColor: 'background.paper',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 