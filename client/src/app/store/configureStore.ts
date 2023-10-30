import {configureStore} from "@reduxjs/toolkit";
import {counterSlice} from "../../features/contact/counterReducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import basketSlice from "../../features/basket/basketSlice";
import {catalogSlice} from "../../features/catalog/catalogSlice";
import {accountSlice} from "../../features/account/accountSlice";
import checkoutSlice from "../../features/checkout/checkoutSlice";

export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        catalog: catalogSlice.reducer,
        account: accountSlice.reducer,
        basket: basketSlice.reducer,
        orders: checkoutSlice.reducer
    },
});

// Basically taking the type from redux and putting to react.

export type Rootstate = ReturnType<typeof store.getState>; //will have the type of the object that represents the entire Redux state.
export const useAppSelector: TypedUseSelectorHook<Rootstate> = useSelector; // selecto things that actually exist in store

type AppDispatch = typeof store.dispatch; // represents the dispatch function of the Redux store
export const useAppDispatch = () => useDispatch<AppDispatch>();
