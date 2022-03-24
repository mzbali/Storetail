import React, { useEffect, useState } from 'react';
import { Product } from '../../app/models/product';
import { ProductList } from './ProductList';

export const Catalog: React.FC = ({}) => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);
  return <ProductList products={products} />;
};
