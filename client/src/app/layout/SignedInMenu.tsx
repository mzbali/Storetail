import React from "react";
import {Button, Menu, MenuItem, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../store/configureStore";
import {signOut} from "../../features/account/accountSlice";
import {resetBasket} from "../../features/basket/basketSlice";

const SignedInMenu: React.FC = () => {
    const {user} = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                onClick={handleClick}
            >
                <Typography variant="h6" color="white">
                    {user?.email}
                </Typography>
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Home</MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link to="/orders" style={{textDecoration: "none", color: "inherit"}}>
                        My Orders
                    </Link>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        dispatch(signOut());
                        dispatch(resetBasket());
                    }}>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default SignedInMenu;
