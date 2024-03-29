import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "../layout/App";
import {Catalog} from "../../features/catalog/Catalog";
import {AboutPage} from "../../features/about/AboutPage";
import {ContactPage} from "../../features/contact/ContactPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import {ProductDetails} from "../../features/catalog/ProductDetails";
import {ServerError} from "../errors/ServerError";
import {NotFound} from "../errors/NotFound";
import RequireAuth from "./RequireAuth";
import {BasketPage} from "../../features/basket/BasketPage";
import OrderPage from "../../features/basket/OrderPage";
import React from "react";
import OrderDetails from "../../features/basket/OrderDetails";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                element: <RequireAuth/>,
                children: [
                    {path: "checkout", element: <CheckoutWrapper/>}
                ]
            },
            {path: "", element: <React.Fragment/>},
            {path: "catalog", element: <Catalog/>},
            {path: "about", element: <AboutPage/>},
            {path: "contact", element: <ContactPage/>},
            {path: "basket", element: <BasketPage/>},
            {path: "login", element: <Login/>},
            {path: "register", element: <Register/>},
            {path: "orders", element: <OrderPage/>},
            {path: "orders/:id", element: <OrderDetails/>},
            {path: "products/:id", element: <ProductDetails/>},
            {path: "server-error", element: <ServerError/>},
            {path: "not-found", element: <NotFound/>},
            {path: "*", element: <Navigate replace to="not-found"/>}
        ]

    }
]);


export default router;