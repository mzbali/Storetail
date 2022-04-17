import React, { useEffect, useState } from 'react';
import agent from '../../app/api/agent';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { Product } from '../../app/models/product';
import { ProductList } from './ProductList';

export const Catalog: React.FC = ({}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    agent.Catalog.catalog()
      .then((data) => setProducts(data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }
  return <ProductList products={products} />;
};
