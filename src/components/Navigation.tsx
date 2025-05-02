import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleClose();
    navigate('/');
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = (
    <>
      {user ? (
        <>
          <MenuItem onClick={() => { handleClose(); navigate('/history'); }}>
            История
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
            Настройки
          </MenuItem>
          <MenuItem onClick={handleSignOut}>Выйти</MenuItem>
        </>
      ) : (
        <>
          <MenuItem onClick={() => { handleClose(); navigate('/login'); }}>
            Войти
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); navigate('/register'); }}>
            Регистрация
          </MenuItem>
        </>
      )}
    </>
  );

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem>
          <Typography variant="h6" component={Link} to={user ? "/app" : "/"} sx={{ textDecoration: 'none', color: 'inherit' }}>StoriesOff</Typography>
        </ListItem>
        <Divider />
        {user ? (
          <>
            <ListItem button onClick={() => navigate('/history')}>
              <ListItemText primary="История" />
            </ListItem>
            <ListItem button onClick={() => navigate('/settings')}>
              <ListItemText primary="Настройки" />
            </ListItem>
            <ListItem button onClick={handleSignOut}>
              <ListItemText primary="Выйти" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button onClick={() => navigate('/login')}>
              <ListItemText primary="Войти" />
            </ListItem>
            <ListItem button onClick={() => navigate('/register')}>
              <ListItemText primary="Регистрация" />
            </ListItem>
          </>
        )}
        <Divider />
        <ListItem button onClick={() => navigate('/payment')}>
          <ListItemText primary="Премиум" sx={{ color: 'primary.main' }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Link to={user ? "/app" : "/"} style={{ textDecoration: 'none', color: 'inherit' }}>StoriesOff</Link>
            </Typography>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawerContent}
            </Drawer>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link to={user ? "/app" : "/"} style={{ textDecoration: 'none', color: 'inherit' }}>StoriesOff</Link>
            </Typography>
            {user ? (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/history')}
                  sx={{ mr: 2 }}
                >
                  История
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/settings')}
                  sx={{ mr: 2 }}
                >
                  Настройки
                </Button>
                <Button 
                  color="primary" 
                  variant="contained"
                  onClick={() => navigate('/payment')}
                  sx={{ 
                    mr: 2,
                    background: 'linear-gradient(45deg, #C0C0C0 30%, #E8E8E8 90%)',
                    color: '#000000',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #A9A9A9 30%, #D3D3D3 90%)',
                    }
                  }}
                >
                  Премиум
                </Button>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {menuItems}
                </Menu>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/login')}
                  sx={{ mr: 1 }}
                >
                  Войти
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/register')}
                  sx={{ mr: 1 }}
                >
                  Регистрация
                </Button>
                <Button 
                  color="primary" 
                  variant="contained"
                  onClick={() => navigate('/payment')}
                  sx={{ 
                    background: 'linear-gradient(45deg, #C0C0C0 30%, #E8E8E8 90%)',
                    color: '#000000',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #A9A9A9 30%, #D3D3D3 90%)',
                    }
                  }}
                >
                  Премиум
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 