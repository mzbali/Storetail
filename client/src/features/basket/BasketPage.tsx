import React from "react";
import {Button, Grid, Typography,} from "@mui/material";
import BasketSummary from "./BasketSummary";
import {useAppSelector} from "../../app/store/configureStore";
import BasketTable from "./BasketTable";
import {Link} from "react-router-dom";

export const BasketPage: React.FC = () => {
    const {basket} = useAppSelector((state) => state.basket);

    if (!basket) return <Typography variant="h3">There is no basket</Typography>;

    return (
        <>
            <BasketTable items={basket.items}/>
            <Grid container>
                <Grid item xs={6}/>
                <Grid item xs={6}>
                    <BasketSummary/>
                    <Button variant="contained" fullWidth component={Link} to="/checkout">
                        Checkout
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};
