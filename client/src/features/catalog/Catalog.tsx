import React, { useEffect } from 'react';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { ProductList } from './ProductList';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { fetchProductsAsync, productSelectors } from './catalogSlice';

export const Catalog: React.FC = ({}) => {
  const products = useAppSelector(productSelectors.selectAll);
  const { status, productsLoaded } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, fetchProductsAsync]);

  if (status.includes('pending')) {
    return <LoadingComponent />;
  }
  return <ProductList products={products} />;
};
