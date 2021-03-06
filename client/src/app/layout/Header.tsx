import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MaterialUISwitch } from './button/MaterialUiSwitch';

interface HeaderProps {
  onSwitchClick: () => void;
  mode: boolean;
}

const midlinks = [
  { title: 'catalog', path: '/catalog' },
  { title: 'about', path: '/about' },
  { title: 'contact', path: '/contact' },
];

const rightlinks = [
  { title: 'login', path: '/login' },
  { title: 'register', path: '/register' },
];

const navStyles = {
  color: 'inherit',
  typography: 'h6',
  textDecoration: 'none',
  '&:hover': { color: 'grey.500' },
  '&.active': { color: 'text.secondary' },
};

export const Header: React.FC<HeaderProps> = ({ onSwitchClick, mode }) => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component={NavLink} to="/" sx={navStyles}>
          StoreTail
        </Typography>

        <List sx={{ display: 'flex' }}>
          {midlinks.map(({ title, path }) => (
            <ListItem key={path} sx={navStyles} component={NavLink} to={path}>
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>
        <Box display="flex" alignItems="center">
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <List sx={{ display: 'flex' }}>
            {rightlinks.map(({ title, path }) => (
              <ListItem key={path} sx={navStyles} component={NavLink} to={path}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
          <MaterialUISwitch onClick={onSwitchClick} checked={mode} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
