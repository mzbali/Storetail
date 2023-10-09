import {useCallback, useEffect, useState} from "react";
import {Container, createTheme, CssBaseline, ThemeProvider,} from "@mui/material";
import {Catalog} from "../../features/catalog/Catalog";
import {Header} from "./Header";
import {Route, Routes} from "react-router-dom";
import {HomePage} from "../../features/home/HomePage";
import {AboutPage} from "../../features/about/AboutPage";
import {ContactPage} from "../../features/contact/ContactPage";
import {ProductDetails} from "../../features/catalog/ProductDetails";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ServerError} from "../errors/ServerError";
import {NotFound} from "../errors/NotFound";
import {BasketPage} from "../../features/basket/BasketPage";
import {LoadingComponent} from "./LoadingComponent";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import {useAppDispatch} from "../store/configureStore";
import {fetchBasketAsync} from "../../features/basket/basketSlice";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import {fetchCurrentUser} from "../../features/account/accountSlice";

const App = () => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const mode = darkMode ? "dark" : "light";

    const initApp = useCallback(async () => {
        try {
            await dispatch(fetchCurrentUser());
            await dispatch(fetchBasketAsync());
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    useEffect(() => {
        initApp().then(() => setLoading(false));
    }, [initApp]);

    const theme = createTheme({
        palette: {
            mode: mode,
            background: {
                default: mode === "light" ? "#eaeaea" : "#121212",
            },
        },
    });
    const toggleThemeHandler = () => setDarkMode(!darkMode);

    if (loading) return <LoadingComponent loadingText="Retrieving Basket"/>;

    return (
        <ThemeProvider theme={theme}>
            <ToastContainer
                hideProgressBar
                closeOnClick
                position="bottom-right"
                theme="colored"
            />
            <CssBaseline/>
            <Header onSwitchClick={toggleThemeHandler} mode={darkMode}/>
            <Container>
                <Routes>
                    <Route path="/basket" element={<BasketPage/>}/>
                    <Route path="/catalog" element={<Catalog/>}/>
                    <Route path="/about" element={<AboutPage/>}/>
                    <Route path="/contact" element={<ContactPage/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/products/:id" element={<ProductDetails/>}/>
                    <Route path="/server-error" element={<ServerError/>}/>
                    <Route path="/not-found" element={<NotFound/>}/>
                    <Route path="/checkout" element={<CheckoutPage/>}/>
                    <Route path="/" element={<HomePage/>}/>
                </Routes>
            </Container>
        </ThemeProvider>
    );
};

export default App;
