import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // <- DeleteIcon import
import { useStoreContext } from '../../app/context/StoreContext';
import { Add, Remove } from '@mui/icons-material';
import agent from '../../app/api/agent';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';

export const BasketPage: React.FC = () => {
  const { basket, setBasket, removeItem } = useStoreContext();
  const [status, setStatus] = useState({
    loading: false,
    name: '',
  });

  const handleAddItem = (productId: number, name: string) => {
    setStatus({ loading: true, name: name });
    agent.Basket.addItems(productId)
      .then((basket) => setBasket(basket))
      .catch((error) => console.log(error))
      .finally(() => setStatus({ loading: false, name: '' }));
  };

  const handleRemoveItem = (
    productId: number,
    quantity: number,
    name: string
  ) => {
    setStatus({ loading: true, name: name });
    agent.Basket.removeItems(productId, quantity)
      .then(() => removeItem(productId, quantity))
      .catch((error) => console.log(error))
      .finally(() => setStatus({ loading: false, name: '' }));
  };

  if (!basket) return <Typography variant="h3">There is no basket</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
          {basket.items.map((item) => (
            <TableRow
              key={item.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box display="flex" alignItems="center">
                  <img
                    src={item.pictureUrl}
                    alt={item.name}
                    style={{ height: '50px', marginRight: '20px' }}
                  />
                  <span>{item.name}</span>
                </Box>
              </TableCell>

              <TableCell align="right">
                {(item.price / 100).toFixed(2)}
              </TableCell>
              <TableCell align="center">
                <LoadingButton
                  loading={
                    status.loading && status.name === 'rem' + item.productId
                  }
                  aria-label="delete"
                  size="large"
                  onClick={() =>
                    handleRemoveItem(item.productId, 1, 'rem' + item.productId)
                  }
                >
                  <Remove fontSize="inherit" color="error" />
                </LoadingButton>
                {item.quantity}
                <LoadingButton
                  aria-label="add"
                  loading={
                    status.loading && status.name === 'add' + item.productId
                  }
                  size="large"
                  onClick={() =>
                    handleAddItem(item.productId, 'add' + item.productId)
                  }
                >
                  <Add fontSize="inherit" color="secondary" />
                </LoadingButton>
              </TableCell>
              <TableCell align="right">
                {((item.price / 100) * item.quantity).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() =>
                    handleRemoveItem(
                      item.productId,
                      item.quantity,
                      'rem' + item.productId
                    )
                  }
                >
                  <DeleteIcon fontSize="inherit" color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
