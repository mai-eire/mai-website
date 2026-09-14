import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  {
    label: 'About',
    children: [
      { label: 'About Us', path: '/about' },
      { label: 'Muslims in Ireland', path: '/muslims-in-ireland' },
      { label: 'FAQ', path: '/faq' },
    ],
  },
  {
    label: 'Services',
    children: [
      { label: 'Our Facilities', path: '/facilities' },
      { label: 'Services Overview', path: '/services' },
    ],
  },
  { label: 'Discover Islam', path: '/discover-islam' },
  { label: 'Events', path: '/events' },
  { label: 'Contact Us', path: '/contact' },
];

// Desktop dropdown menu for a nav item with children
const NavDropdown = ({ label, items }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        endIcon={<ExpandMore />}
        sx={{
          color: open ? 'primary.main' : 'text.primary',
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: 'transparent',
            color: 'primary.main',
          },
        }}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        MenuListProps={{ sx: { py: 1 } }}
      >
        {items.map((child) => (
          <MenuItem
            key={child.label}
            component={Link}
            href={child.path}
            onClick={() => setAnchorEl(null)}
            sx={{
              color: 'text.primary',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.08)',
                color: 'primary.main',
              },
            }}
          >
            {child.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const toggleSection = (label) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Image
          src="/assets/MAI_Logo.png"
          alt="MAI Logo"
          width={112}
          height={48}
          priority
        />
      </Box>
      <Divider />
      <List>
        {navItems.map((item) =>
          item.children ? (
            <React.Fragment key={item.label}>
              <ListItemButton
                onClick={() => toggleSection(item.label)}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.08)' },
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiTypography-root': {
                      color: 'text.primary',
                      fontWeight: 600,
                    },
                  }}
                />
                {openSections[item.label] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={!!openSections[item.label]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.label}
                      component={Link}
                      href={child.path}
                      onClick={handleDrawerToggle}
                      sx={{
                        pl: 4,
                        '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.08)' },
                      }}
                    >
                      <ListItemText
                        primary={child.label}
                        sx={{
                          '& .MuiTypography-root': {
                            color: 'text.primary',
                            fontWeight: 500,
                          },
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItemButton
              key={item.label}
              component={Link}
              href={item.path}
              onClick={handleDrawerToggle}
              sx={{
                '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.08)' },
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiTypography-root': {
                    color: 'text.primary',
                    fontWeight: 600,
                  },
                }}
              />
            </ListItemButton>
          )
        )}
        {/* TODO: Patron flow not ready yet — re-enable when /dashboard works.
        <ListItemButton
          component={Link}
          href="/dashboard"
          onClick={handleDrawerToggle}
          sx={{ mt: 2, '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.08)' } }}
        >
          <ListItemText
            primary="Become an MAI Patron"
            sx={{ '& .MuiTypography-root': { color: 'primary.main', fontWeight: 600 } }}
          />
        </ListItemButton>
        */}
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
                  src="/assets/MAI_Logo.png"
                  alt="MAI Logo"
                  width={84}
                  height={36}
                  priority
                />
              </Box>
            </Link>

            {/* Mobile Menu Button */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* TODO: Patron flow not ready yet — re-enable when /dashboard works.
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
                */}
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
                {navItems.map((item) =>
                  item.children ? (
                    <NavDropdown key={item.label} label={item.label} items={item.children} />
                  ) : (
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
                  )
                )}
                {/* TODO: Patron flow not ready yet — re-enable when /dashboard works.
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
                    Become an MAI Patron
                  </Button>
                </Link>
                */}
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
