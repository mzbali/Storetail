import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardHeader,
  Avatar,
  Grid,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../app/models/product';
import agent from '../../app/api/agent';
import { useStoreContext } from '../../app/context/StoreContext';
import { LoadingButton } from '@mui/lab';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setBasket } = useStoreContext();
  const [loading, setLoading] = useState(false);

  const handleAddItem = (productId: number) => {
    setLoading(true);
    agent.Basket.addItems(productId)
      .then((basket) => setBasket(basket))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };
  return (
    <Grid item xs={3}>
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'secondary.light' }} aria-label="Brand Logo">
              {product.name.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={product.name}
          titleTypographyProps={{
            sx: { fontWeight: 'bold', color: 'primary.main' },
          }}
        />
        <CardMedia
          component="img"
          height="140"
          sx={{ objectFit: 'contain', bgcolor: 'primary.light' }}
          image={product.pictureUrl}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5">
            ${(product.price / 100).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.brand} / {product.type}
          </Typography>
        </CardContent>
        <CardActions>
          <LoadingButton
            size="small"
            loading={loading}
            onClick={() => handleAddItem(product.id)}
          >
            Add to cart
          </LoadingButton>
          <Button size="small" component={Link} to={`/products/${product.id}`}>
            View
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};
