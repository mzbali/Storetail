import React, { useEffect } from "react";
import { LoadingComponent } from "../../app/layout/LoadingComponent";
import { ProductList } from "./ProductList";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { Grid, Paper } from "@mui/material";
import {
  fetchFiltersAsync,
  fetchProductsAsync,
  productSelectors,
  setProductParams,
} from "./catalogSlice";
import SearchProduct from "../../app/components/SearchProduct";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckBoxButtons from "../../app/components/CheckBoxButtons";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "price", label: "Price - Low to High" },
  { value: "priceDesc", label: "Price - High to Low" },
];

export const Catalog: React.FC = ({}) => {
  const products = useAppSelector(productSelectors.selectAll);
  const { productsLoaded, filtersFetched, brands, types, productParams } =
    useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [dispatch, productsLoaded, fetchProductsAsync]);

  useEffect(() => {
    if (!filtersFetched) dispatch(fetchFiltersAsync());
  }, [filtersFetched, fetchFiltersAsync, dispatch]);

  if (!productsLoaded) {
    return <LoadingComponent />;
  }
  return (
    <Grid container columnSpacing={2}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <SearchProduct />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            options={sortOptions}
            onChange={(e: any) =>
              dispatch(setProductParams({ orderBy: e.target.value }))
            }
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckBoxButtons
            items={brands}
            checked={productParams.brands}
            onChange={(items) => dispatch(setProductParams({ brands: items }))}
            checkBoxLabel="Brands"
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckBoxButtons
            items={types}
            checked={productParams.types}
            onChange={(items) => dispatch(setProductParams({ types: items }))}
            checkBoxLabel="Types"
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
    </Grid>
  );
};
