import { Grid } from '@mui/material';
import React from 'react';
import { Product } from '../../app/models/product';
import { ProductCard } from './ProductCard';

interface ProductsListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductsListProps> = ({ products }) => {
  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Grid>
  );
};
