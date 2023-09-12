import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Basket } from '../../app/models/basket';
import agent from '../../app/api/agent';

interface BasketState {
  basket: Basket | null;
  status: string;
}

const initialState: BasketState = {
  basket: null,
  status: '',
};

export const addBasketItemAsync = createAsyncThunk<
  Basket,
  { productId: number; quantity: number; name?: string }
>(
  'baskets/addBasketItemAsync',
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      return await agent.Basket.addItems(productId, quantity);
    } catch (error: any) {
      thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const removeBasketItemAsync = createAsyncThunk<
  void,
  { productId: number; quantity: number; name?: string }
>(
  'baskets/removeBasketItem',
  async ({ productId, quantity, name }, thunkAPI) => {
    try {
      await agent.Basket.removeItems(productId, quantity);
    } catch (error: any) {
      thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      state.status =
        'pendingAddItem' + action.meta.arg.productId + action.meta.arg.name;
    });
    builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.basket = action.payload;
    });
    builder.addCase(addBasketItemAsync.rejected, (state, action) => {
      state.status = 'idle';
      console.log(action.payload);
    });

    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      state.status =
        'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
    });
    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      const findIndex = state.basket?.items.findIndex(
        (i) => i.productId === action.meta.arg.productId
      );
      if (findIndex === -1 || findIndex === undefined) return;
      state.basket!.items[findIndex].quantity -= action.meta.arg.quantity;
      if (state.basket!.items[findIndex].quantity === 0)
        state.basket?.items.splice(findIndex, 1);
      state.status = 'idle';
    });
    builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
      state.status = 'idle';
      console.log(action.payload);
    });
  },
});

export const { setBasket } = basketSlice.actions;

export default basketSlice;
