import React from "react";
import {createRoot} from "react-dom/client";
import "./app/layout/styles.css";
import {Provider} from "react-redux";
import {store} from "./app/store/configureStore";
import {RouterProvider} from "react-router-dom";
import router from "./app/router/Routes";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </React.StrictMode>
);
