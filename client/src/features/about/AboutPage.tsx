import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import agent from '../../app/api/agent';

interface AboutPageProps {}

export const AboutPage: React.FC<AboutPageProps> = ({}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const invokeError = {
    get400: () =>
      agent.Buggy.get400Error().catch((error) => console.log(error)),
    get401: () =>
      agent.Buggy.get401Error().catch((error) => console.log(error)),
    get404: () =>
      agent.Buggy.get404Error().catch((error) => console.log(error)),
    get500: () =>
      agent.Buggy.get500Error().catch((error) => console.log(error)),
    getValidationError: () =>
      agent.Buggy.getValidationError().catch((error) =>
        setValidationErrors(error)
      ),
  };
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Errors for testing purpose
      </Typography>
      <ButtonGroup variant="contained" fullWidth sx={{ mb: 2 }}>
        <Button onClick={invokeError.get400}>Test 400 Error</Button>
        <Button onClick={invokeError.get401}>Test 401 Error</Button>
        <Button onClick={invokeError.get404}>Test 404 Error</Button>
        <Button onClick={invokeError.get500}>Test 500 Error</Button>
        <Button onClick={invokeError.getValidationError}>
          Test Validation Error
        </Button>
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <List>
            {validationErrors.map((errMsg) => (
              <ListItem key={errMsg}>
                <ListItemText>{errMsg}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </>
  );
};
