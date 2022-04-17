import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

export const BtnToCatalog: React.FC = ({}) => {
  return (
    <Button component={Link} to="/catalog">
      Go Back to Catalog
    </Button>
  );
};
