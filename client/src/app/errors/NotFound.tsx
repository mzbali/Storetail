import { Container, Typography, Paper } from '@mui/material';
import React from 'react';
import { BtnToCatalog } from '../layout/button/BtnToCatalog';

interface NotFoundProps {}

export const NotFound: React.FC<NotFoundProps> = ({}) => {
  return (
    <Container component={Paper}>
      <Typography variant="h4" sx={{ paddingY: '8px' }}>
        Oops! The page you are looking for cannot be found
      </Typography>
      <BtnToCatalog />
    </Container>
  );
};
