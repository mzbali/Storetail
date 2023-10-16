import React from "react";
import ReactDOM from "react-dom";
import "./app/layout/styles.css";
import {Provider} from "react-redux";
import {store} from "./app/store/configureStore";
import {RouterProvider} from "react-router-dom";
import router from "./app/router/Routes";


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
