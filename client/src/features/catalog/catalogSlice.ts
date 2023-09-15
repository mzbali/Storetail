import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { Product } from '../../app/models/product';
import agent from '../../app/api/agent';
import { Rootstate } from '../../app/store/configureStore';

const productsAdapters = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[], void>(
  'catalog/fetchProductsAsync',
  async (_, thunkAPI) => {
    try {
      return await agent.Catalog.catalog();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchProductAsync = createAsyncThunk<Product, number>(
  'catalog/fetchProductAsync',
  async (productId: number, thunkAPI) => {
    try {
      const product = await agent.Catalog.details(productId);
      return product;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState: productsAdapters.getInitialState({
    status: 'idle',
    productsLoaded: false,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductsAsync.pending, (state, _) => {
      state.status = 'pendingFetchProducts';
    });
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      productsAdapters.setAll(state, action.payload);
      state.status = 'idle';
      state.productsLoaded = true;
    });
    builder.addCase(fetchProductsAsync.rejected, (state, _) => {
      state.status = 'idle';
    });
    builder.addCase(fetchProductAsync.pending, (state, _) => {
      state.status = 'pendingFetchProduct';
    });
    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      productsAdapters.upsertOne(state, action.payload);
      state.status = 'idle';
    });
    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      console.log(action);
      state.status = 'idle';
    });
  },
});

export const productSelectors = productsAdapters.getSelectors<Rootstate>(
  (state) => state.catalog
);
