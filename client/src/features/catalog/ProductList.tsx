import { Grid } from "@mui/material";
import React from "react";
import { Product } from "../../app/models/product";
import { ProductCard } from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface ProductsListProps {
  products: Product[];
  productsLoaded: boolean;
}

export const ProductList: React.FC<ProductsListProps> = ({
  products,
  productsLoaded,
}) => {
  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid item xs={4} key={product.id}>
          {productsLoaded ? (
            <ProductCard product={product} />
          ) : (
            <ProductCardSkeleton />
          )}
        </Grid>
      ))}
    </Grid>
  );
};
