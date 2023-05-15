import { useEffect, useState } from 'react';
import { Basket } from '../../app/models/basket';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { Typography } from '@mui/material';
import agent from '../../app/api/agent';

export const BasketPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [basket, setBasket] = useState<Basket | null>(null);

  useEffect(() => {
    agent.Basket.get()
      .then((basket) => {
        setBasket(basket);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (loading) return <LoadingComponent loadingText="Loading Basket..." />;

  if (!basket) return <Typography variant="h3">There is no basket</Typography>;

  return <h1>Buyer ID= {basket?.buyerId}</h1>;
};
