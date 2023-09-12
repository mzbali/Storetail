import { configureStore } from '@reduxjs/toolkit';
import { counterSlice } from '../../features/contact/counterReducer';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import basketSlice from '../../features/basket/basketSlice';

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    basket: basketSlice.reducer,
  },
});

// Basically taking the type from redux and putting to react.

type Rootstate = ReturnType<typeof store.getState>; //will have the type of the object that represents the entire Redux state.
export const useAppSelector: TypedUseSelectorHook<Rootstate> = useSelector; // selecto things that actually exist in store

type AppDispatch = typeof store.dispatch; // represents the dispatch function of the Redux store
export const useAppDispatch = () => useDispatch<AppDispatch>();
