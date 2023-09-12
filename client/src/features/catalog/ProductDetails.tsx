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
import agent from '../../app/api/agent';
import { NotFound } from '../../app/errors/NotFound';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { Product } from '../../app/models/product';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import {
  addBasketItemAsync,
  removeBasketItemAsync,
} from '../basket/basketSlice';

interface ProductDetailsProps {}

export const ProductDetails: React.FC<ProductDetailsProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { basket, status } = useAppSelector((state) => state.basket);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const item = basket?.items.find((i) => i.productId === product?.id);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    agent.Catalog.details(parseInt(id ? id : '0')) // take note, comeback later
      .then((data) => setProduct(data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity(0);
    } else if (parseInt(value) >= 0) {
      setQuantity(parseInt(value));
    }
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

  if (loading) {
    return <LoadingComponent loadingText="Loading Product..." />;
  }
  if (!product && !loading) {
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
                loading={
                  status === 'pendingRemoveItem' + item?.productId + item?.name
                }
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
