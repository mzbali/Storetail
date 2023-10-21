import {Paper, Table, TableBody, TableCell, TableContainer, TableRow,} from "@mui/material";
import {currencyFormat} from "../../app/utils/utils";
import {useAppSelector} from "../../app/store/configureStore";

const BasketSummary = () => {
    const {basket} = useAppSelector((state) => state.basket);
    const subtotal = basket
        ? basket.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        : 0;
    const deliveryFee = subtotal >= 10000 ? 0 : 500;
    return (
        <>
            <TableContainer component={Paper} variant={"outlined"}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{currencyFormat(subtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">
                                {currencyFormat(subtotal + deliveryFee)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                <span style={{fontStyle: "italic"}}>
                  *Orders over £100 qualify for free delivery
                </span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default BasketSummary;
