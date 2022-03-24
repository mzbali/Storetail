import { useState } from 'react';
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { Catalog } from '../../features/catalog/Catalog';
import { Header } from './Header';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const mode = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: mode,
      background: {
        default: mode === 'light' ? '#eaeaea' : '#121212',
      },
    },
  });
  const toggleThemeHandler = () => setDarkMode(!darkMode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header onSwitchClick={toggleThemeHandler} mode={darkMode} />
      <Container>
        <Catalog />
      </Container>
    </ThemeProvider>
  );
};

export default App;
