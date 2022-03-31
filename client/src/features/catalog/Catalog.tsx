import React, { useEffect, useState } from 'react';
import agent from '../../app/api/agent';
import { Product } from '../../app/models/product';
import { ProductList } from './ProductList';

export const Catalog: React.FC = ({}) => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    agent.Catalog.catalog()
      .then((data) => setProducts(data))
      .catch((error) => console.log(error));
  }, []);
  return <ProductList products={products} />;
};
