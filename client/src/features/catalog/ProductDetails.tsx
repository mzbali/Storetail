import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NotFound } from '../../app/errors/NotFound';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import {
  addBasketItemAsync,
  removeBasketItemAsync,
} from '../basket/basketSlice';
import { fetchProductAsync, productSelectors } from './catalogSlice';

interface ProductDetailsProps {}

export const ProductDetails: React.FC<ProductDetailsProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { basket, status } = useAppSelector((state) => state.basket);
  const { status: productStatus } = useAppSelector((state) => state.catalog);
  const product = useAppSelector((state) =>
    productSelectors.selectById(state, id!)
  );
  const item = basket?.items.find((i) => i.productId === product?.id);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
    if (!product) dispatch(fetchProductAsync(parseInt(id!)));
  }, [item, id, fetchProductAsync, dispatch]);

  const handleInputChange = (e: any) => {
    if (parseInt(e.target.value) >= 0) setQuantity(parseInt(e.target.value));
  };

  const handleUpdateQuantity = () => {
    if (!item || quantity > item.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      dispatch(
        addBasketItemAsync({
          productId: product!.id,
          quantity: updatedQuantity,
        })
      );
    } else {
      const updatedQuantity = item.quantity - quantity;
      dispatch(
        removeBasketItemAsync({
          productId: product!.id,
          quantity: updatedQuantity,
        })
      );
    }
  };

  if (productStatus.includes('pending')) {
    return <LoadingComponent loadingText="Loading Product..." />;
  }
  if (!product && productStatus.includes('idle')) {
    return <NotFound />;
  }
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <img
            src={product!.pictureUrl}
            alt={product!.name}
            width="100%"
            style={{ backgroundColor: '#FDEFF4', objectFit: 'contain' }}
          />
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h3">{product!.name}</Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name:</TableCell>
                  <TableCell>{product!.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Type:</TableCell>
                  <TableCell>{product!.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brand:</TableCell>
                  <TableCell>{product!.brand}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description:</TableCell>
                  <TableCell>{product!.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Price:</TableCell>
                  <TableCell>${(product!.price / 100).toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                onChange={handleInputChange}
                id="outlined-basic"
                type="number"
                label="Quantity in Cart"
                variant="outlined"
                sx={{ marginRight: '20px' }}
                value={quantity}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <LoadingButton
                disabled={
                  item?.quantity === quantity || (!item && quantity === 0)
                }
                variant="contained"
                loading={status.includes('pending')}
                sx={{ height: '55px' }}
                onClick={handleUpdateQuantity}
                fullWidth
              >
                {item ? 'Update Quantity' : 'Add Item'}
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
