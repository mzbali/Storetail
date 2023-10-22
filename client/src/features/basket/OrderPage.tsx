import React, {useEffect} from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore";
import {fetchOrdersAsync} from "../checkout/checkoutSlice";
import {currencyFormat} from "../../app/utils/utils";

const OrderPage: React.FC = () => {
    const {orders} = useAppSelector(state => state.orders);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchOrdersAsync());
    }, [dispatch]);

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="caption table">
                <caption>Number of Orders.</caption>
                <TableHead>
                    <TableRow>
                        <TableCell>Order No.</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Order Date</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders?.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell component="th" scope="row">
                                {order.id}
                            </TableCell>
                            <TableCell align="right">{order.orderItems.length}</TableCell>
                            <TableCell align="right">{currencyFormat(order.total)}</TableCell>
                            <TableCell align="right">{order.orderDate.split("T")[0]}</TableCell>
                            <TableCell align="right">{order.orderStatus}</TableCell>
                            <TableCell align="right"><Link to={`/orders/${order.id}`}>View</Link></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OrderPage;





