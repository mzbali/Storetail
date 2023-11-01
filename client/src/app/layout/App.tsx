import {useCallback, useEffect, useState} from "react";
import {Container, createTheme, CssBaseline, ThemeProvider,} from "@mui/material";
import {Header} from "./Header";
import {Outlet, useLocation} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {LoadingComponent} from "./LoadingComponent";
import {useAppDispatch} from "../store/configureStore";
import {fetchBasketAsync} from "../../features/basket/basketSlice";
import {fetchCurrentUser} from "../../features/account/accountSlice";
import {HomePage} from "../../features/home/HomePage";

const App = () => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const mode = darkMode ? "dark" : "light";

    const location = useLocation();

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
            {location.pathname === "/" ? <HomePage/> :
                <Container sx={{pt: 4}}>
                    <Outlet/>
                </Container>}
        </ThemeProvider>
    );
};

export default App;
