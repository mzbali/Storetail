import React, {useEffect, useState} from "react";
import BasketTable from "./BasketTable";
import {Link, useParams} from "react-router-dom";
import {BasketItem} from "../../app/models/basket";
import BasketSummary from "./BasketSummary";
import {Box, Button, Grid, Typography} from "@mui/material";
import {LoadingComponent} from "../../app/layout/LoadingComponent";
import agent from "../../app/api/agent";
import {Order} from "../../app/models/order";

const OrderDetails: React.FC = () => {
    const {id} = useParams();
    const [order, setOrder] = useState<Order | null>(null);

    // Parse id and provide a default value of 0 if parsing fails
    const parsedId = parseInt(id as string) ?? 0;

    useEffect(() => {
        agent.Order.order(parsedId)
            .then(value => setOrder(value))
            .catch(e => console.log(e));
    }, []);

    if (order === null || parsedId < 0) {
        return <LoadingComponent loadingText="Loading Orders"/>;
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
                <BasketTable items={order.orderItems as BasketItem[]} isBasket={false}/>
            </Grid>
            <Grid item xs={6}/>
            <Grid item xs={6}>
                <BasketSummary subtotal={order.subTotal}/>
            </Grid>
        </Grid>
    );
};


export default OrderDetails;