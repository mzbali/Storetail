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
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../app/models/product";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  return (
    <Grid item xs={4}>
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "secondary.light" }} aria-label="Brand Logo">
              {product.name.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={product.name}
          titleTypographyProps={{
            sx: { fontWeight: "bold", color: "primary.main" },
          }}
        />
        <CardMedia
          component="img"
          height="140"
          sx={{ objectFit: "contain", bgcolor: "primary.light" }}
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
            loading={status === "pendingAddItem" + product.id + product.name}
            onClick={() =>
              dispatch(
                addBasketItemAsync({
                  productId: product.id,
                  quantity: 1,
                  name: product.name,
                })
              )
            }
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
