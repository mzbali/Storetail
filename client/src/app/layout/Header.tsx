import {AppBar, Badge, Box, IconButton, List, ListItem, Toolbar, Typography,} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import {MaterialUISwitch} from './button/MaterialUiSwitch';
import {useAppSelector} from '../store/configureStore';
import SignedInMenu from "./SignedInMenu";

interface HeaderProps {
    onSwitchClick: () => void;
    mode: boolean;
}

const midlinks = [
    {title: 'catalog', path: '/catalog'},
    {title: 'about', path: '/about'},
    {title: 'contact', path: '/contact'},
];

const rightlinks = [
    {title: 'login', path: '/login'},
    {title: 'register', path: '/register'},
];

const navStyles = {
    color: 'inherit',
    typography: 'h6',
    textDecoration: 'none',
    '&:hover': {color: 'grey.500'},
    '&.active': {color: 'text.secondary'},
};

export const Header: React.FC<HeaderProps> = ({onSwitchClick, mode}) => {
    const {user} = useAppSelector(state => state.account)
    const {basket} = useAppSelector((state) => state.basket);
    const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <AppBar position="static">
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

                <List sx={{display: 'flex'}}>
                    {midlinks.map(({title, path}) => (
                        <ListItem key={path} sx={navStyles} component={NavLink} to={path}>
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>
                <Box display="flex" alignItems="center">
                    <IconButton color="inherit" component={Link} to="/basket">
                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCartIcon/>
                        </Badge>
                    </IconButton>
                    {user?.email ? <SignedInMenu/> :
                        <List sx={{display: 'flex'}}>
                            {rightlinks.map(({title, path}) => (
                                    <ListItem key={path} sx={navStyles} component={NavLink} to={path}>
                                        {title.toUpperCase()}
                                    </ListItem>
                                )
                            )}
                        </List>}
                    <MaterialUISwitch onClick={onSwitchClick} checked={mode}/>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
