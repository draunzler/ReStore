import { ShoppingCart } from '@mui/icons-material';
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store';

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

const midLinks = [
  { title: 'catalog', path: '/catalog' },
  { title: 'about', path: '/about' },
  { title: 'contact', path: '/contact' },
];

const rightLinks = [
  { title: 'login', path: '/login' },
  { title: 'register', path: '/register' },
];

const navStyles = {
  color: 'inherit',
  textDecoration: 'none',
  typography: 'h6',
  '&:hover': {
    color: 'grey.500',
  },
  '&.active': {
    color: 'text.secondary',
  },
};

function Header({ darkMode, handleThemeChange }: Props) {
  const { basketStore, userStore } = useStore();
  const { user, logout } = userStore;
  const { basketCount } = basketStore;

  return (
    <AppBar position='static' sx={{ mb: 4 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display='flex' alignItems='center'>
          <Typography
            variant='h6'
            component={NavLink}
            to='/'
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            RE-STORE
          </Typography>
          <Switch checked={darkMode} onChange={handleThemeChange} />
        </Box>

        <List sx={{ display: 'flex' }}>
          {midLinks.map(({ title, path }) => (
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={navStyles}
            >
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>

        <Box display='flex' alignItems='center'>
          <IconButton component={Link} to='/basket' size='large' sx={{ color: 'inherit' }}>
            <Badge badgeContent={basketCount} color='secondary'>
              <ShoppingCart />
            </Badge>
          </IconButton>
          {user ? (
            <List sx={{ display: 'flex' }}>
              <ListItem sx={navStyles}>
                {user.displayName}
              </ListItem>
              <ListItem
                onClick={logout}
                sx={{ ...navStyles, cursor: 'pointer' }}
              >
                LOGOUT
              </ListItem>
            </List>
          ) : (
            <List sx={{ display: 'flex' }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default observer(Header);