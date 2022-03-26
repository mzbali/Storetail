import { useState } from 'react';
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { Catalog } from '../../features/catalog/Catalog';
import { Header } from './Header';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../../features/home/HomePage';
import { AboutPage } from '../../features/about/AboutPage';
import { ContactPage } from '../../features/contact/ContactPage';
import { ProductDetails } from '../../features/catalog/ProductDetails';

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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
