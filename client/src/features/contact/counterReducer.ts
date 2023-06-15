import { createSlice } from '@reduxjs/toolkit';

interface CounterState {
  count: number;
  text: string;
}

const initialState: CounterState = {
  count: 0,
  text: 'YARC - yet another redux counter',
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState: initialState,
  reducers: {
    increment: (state, action) => {
      state.count += action.payload;
    },
    decrement: (state, action) => {
      state.count -= action.payload;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;
