import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Settings from '@mui/icons-material/Settings';
import LoginController from './LoginController';


function ResponsiveAppBar(props) {
  const [user, setUser] = useState(null); // Change to mock a logged-in user


  const handleLogin = () => {
    // Replace with real logic
    setUser({ firstName: 'John', lastName: 'Doe' });
  };

  const handleRegister = () => {
    console.log('Register clicked');
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleProfile = () => {
    console.log('Profile clicked');
  };



  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMenuItemClick = (path) => {
    handleCloseNavMenu();

    window.location.href = path;
  };



  return (
    <AppBar color='inherit' elevation={0} position="static">
      <Toolbar disableGutters>

        {props.AppBarData.icon}
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          {props.AppBarData.website_name}
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="primary"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            {props.AppBarData.pages.map((page) => {
              if (page.is_in_RAB === true) {
                return <MenuItem key={page.page_path} onClick={() => handleMenuItemClick(page.page_path)}>
                  <Typography sx={{ textAlign: 'center' }}>{page.page_name}</Typography>
                </MenuItem>
              } else {
                return null
              }
            }
            )}

            <LoginController
              user={user}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onLogout={handleLogout}
              onProfile={handleProfile}
            />
          </Menu>
        </Box>

        {props.AppBarData.icon2}
        <Typography
          variant="h5"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          {props.AppBarData.website_name}
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {props.AppBarData.pages.map((page) => {
            if (page.is_in_RAB === true) {
              return <Button
                key={page.page_path}
                href={page.page_path}
                size='small'
                color='inherit'
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2, mx: 1, display: 'block',
                  textTransform: 'none',
                  textAlign: 'center',
                  fontWeight:'bold'
                }}
              >
                {page.page_name}
              </Button>
            }
            else {
              return null
            }
          }

          )}
          <LoginController
            user={user}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onLogout={handleLogout}
            onProfile={handleProfile}
          />

        </Box>



        <IconButton
          size="large"
          color='primary'
          href='/settings'
        >
          <Settings />
        </IconButton>

      </Toolbar>
    </AppBar>
  );
}
export default ResponsiveAppBar;
