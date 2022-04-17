import { Container, Typography, Paper } from '@mui/material';
import React from 'react';
import { BtnToCatalog } from '../layout/button/BtnToCatalog';

interface NotFoundProps {}

export const NotFound: React.FC<NotFoundProps> = ({}) => {
  return (
    <Container component={Paper}>
      <Typography variant="h4">Ooops... page not found</Typography>
      <BtnToCatalog />
    </Container>
  );
};
