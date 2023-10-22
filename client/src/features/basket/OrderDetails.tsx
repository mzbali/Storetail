import React, {useEffect} from "react";
import BasketTable from "./BasketTable";
import {Link, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore";
import {BasketItem} from "../../app/models/basket";
import BasketSummary from "./BasketSummary";
import {Box, Button, Grid, Typography} from "@mui/material";
import {fetchOrdersAsync} from "../checkout/checkoutSlice";

const OrderDetails: React.FC = () => {
    const {id} = useParams();
    const {orders} = useAppSelector(state => state.orders);
    const dispatch = useAppDispatch();

    // Parse id and provide a default value of 0 if parsing fails
    const parsedId = parseInt(id as string) ?? 0;

    useEffect(() => {
        try {
            dispatch(fetchOrdersAsync());
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    if (!orders || parsedId < 0) {
        return null;
    }

    return (<Grid container>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="h5" mb={2}>
                        Order #{parsedId}
                    </Typography>
                    <Link to="/orders">
                        <Button variant="contained">Back to Orders</Button>
                    </Link>
                </Box>
                <BasketTable items={orders![parsedId]?.orderItems as BasketItem[]} isBasket={false}/>
            </Grid>
            <Grid item xs={6}/>
            <Grid item xs={6}>
                <BasketSummary subtotal={orders![parsedId]?.subTotal}/>
            </Grid>
        </Grid>
    );
};


export default OrderDetails;