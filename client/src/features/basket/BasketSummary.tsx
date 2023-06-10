import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@mui/material';
import { useStoreContext } from '../../app/context/StoreContext';
import { currencyFormat } from '../../app/utils/utils';
import { Link } from 'react-router-dom';

const BasketSummary = () => {
  const { basket } = useStoreContext();
  const subtotal = basket
    ? basket.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;
  const deliveryFee = subtotal >= 10000 ? 0 : 500;
  return (
    <>
      <TableContainer component={Paper} variant={'outlined'}>
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
                <span style={{ fontStyle: 'italic' }}>
                  *Orders over £100 qualify for free delivery
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" fullWidth component={Link} to="/checkout">
        Checkout
      </Button>
    </>
  );
};

export default BasketSummary;
