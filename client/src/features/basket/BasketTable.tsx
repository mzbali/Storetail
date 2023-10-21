import React from "react";
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {Add, Delete, Remove} from "@mui/icons-material";
import {BasketItem} from "../../app/models/basket";
import {currencyFormat} from "../../app/utils/utils";
import {addBasketItemAsync, removeBasketItemAsync} from "./basketSlice";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore";

interface TableContentProps {
    items: BasketItem[];
    isBasket?: boolean;
}

const TableContent: React.FC<TableContentProps> = ({items, isBasket = true}) => {
    const dispatch = useAppDispatch();
    const {status} = useAppSelector(state => state.basket);
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => (
                        <TableRow
                            key={item.name}
                            sx={{"&:last-child td, &:last-child th": {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                <Box display="flex" alignItems="center">
                                    <img
                                        src={item.pictureUrl}
                                        alt={item.name}
                                        style={{height: "50px", marginRight: "20px"}}
                                    />
                                    <span>{item.name}</span>
                                </Box>
                            </TableCell>

                            <TableCell align="right">
                                {currencyFormat(item.price)}
                            </TableCell>
                            <TableCell align="center">
                                {isBasket && <LoadingButton
                                    loading={
                                        status ===
                                        "pendingRemoveItem" + item.productId + item.name
                                    }
                                    aria-label="delete"
                                    size="large"
                                    onClick={() =>
                                        dispatch(
                                            removeBasketItemAsync({
                                                productId: item.productId,
                                                quantity: 1,
                                                name: item.name,
                                            })
                                        )
                                    }
                                    color="error"
                                >
                                    <Remove/>
                                </LoadingButton>
                                }
                                {item.quantity}
                                {isBasket && <LoadingButton
                                    aria-label="add"
                                    loading={
                                        status === "pendingAddItem" + item.productId + item.name
                                    }
                                    size="large"
                                    onClick={() =>
                                        dispatch(
                                            addBasketItemAsync({
                                                productId: item.productId,
                                                quantity: 1,
                                                name: item.name,
                                            })
                                        )
                                    }
                                    color="secondary"
                                >
                                    <Add/>
                                </LoadingButton>}
                            </TableCell>
                            <TableCell align="right">
                                {((item.price / 100) * item.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                                {isBasket && <LoadingButton
                                    loading={
                                        status ===
                                        "pendingRemoveItem" + item.productId + item.name
                                    }
                                    aria-label="delete"
                                    size="large"
                                    onClick={() =>
                                        dispatch(
                                            removeBasketItemAsync({
                                                productId: item.productId,
                                                quantity: item.quantity,
                                                name: item.name,
                                            })
                                        )
                                    }
                                    color="error"
                                >
                                    <Delete/>
                                </LoadingButton>}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>);
};

export default TableContent;