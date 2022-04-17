import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';
import React from 'react';

interface LoadingComponentProps {
  loadingText?: string;
}

export const LoadingComponent: React.FC<LoadingComponentProps> = ({
  loadingText = 'Loading...',
}) => {
  return (
    <Backdrop open hidden>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ height: '100vh' }}
      >
        <CircularProgress size={100} color="secondary" />
        <Typography sx={{ position: 'fixed', top: '60%' }} color="grey.900">
          {loadingText}
        </Typography>
      </Box>
    </Backdrop>
  );
};
