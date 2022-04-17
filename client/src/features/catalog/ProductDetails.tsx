import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import agent from '../../app/api/agent';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { Product } from '../../app/models/product';

interface ProductDetailsProps {}

export const ProductDetails: React.FC<ProductDetailsProps> = ({}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    agent.Catalog.details(parseInt(id ? id : '0')) // take note, comeback later
      .then((data) => setProduct(data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);
  if (loading) {
    return <LoadingComponent loadingText="Loading Product..." />;
  }
  if (!product) {
    return <Typography variant="h3"> Could Not Load Product</Typography>;
  }
  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          width="100%"
          style={{ backgroundColor: '#FDEFF4' }}
        />
      </Grid>
      <Grid item xs={8}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name:</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type:</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand:</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description:</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Price:</TableCell>
                <TableCell>${(product.price / 100).toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
