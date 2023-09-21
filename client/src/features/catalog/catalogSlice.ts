import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { Rootstate } from "../../app/store/configureStore";

// Type of the redux state for products/catalog
export interface ProductState {
  status: string;
  productsLoaded: boolean;
  filtersFetched: boolean;
  brands: string[];
  types: string[];
  productParams: ProductParams;
}

// Initialising the default query string to be sent when fetching products
const initParams = () => {
  return {
    orderBy: "name",
    pageSize: 6,
    pageNumber: 1,
  };
};

//Initialising Axios Query Search Params
const getAxiosParams = (productParams: ProductParams) => {
  const params = new URLSearchParams();
  params.append("orderBy", productParams.orderBy);
  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  if (productParams.searchTerm)
    params.append("searchTerm", productParams.searchTerm);
  if (productParams.brands)
    params.append("brands", productParams.brands.toString());
  if (productParams.types)
    params.append("types", productParams.types.toString());
  return params;
};

const productsAdapters = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<
  Product[],
  void,
  { state: Rootstate }
>("catalog/fetchProductsAsync", async (_, thunkAPI) => {
  const params = thunkAPI.getState().catalog.productParams;
  try {
    return await agent.Catalog.catalog(getAxiosParams(params));
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchProductAsync = createAsyncThunk<Product, number>(
  "catalog/fetchProductAsync",
  async (productId: number, thunkAPI) => {
    try {
      const product = await agent.Catalog.details(productId);
      return product;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchFiltersAsync = createAsyncThunk(
  "catalog/fetchFiltersAsync",
  async (_, thunkAPI) => {
    try {
      return await agent.Catalog.fetchFilters();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productsAdapters.getInitialState<ProductState>({
    status: "idle",
    productsLoaded: false,
    filtersFetched: false,
    brands: [],
    types: [],
    productParams: initParams(),
  }),
  reducers: {
    setProductParams: (state, action) => {
      state.productsLoaded = false;
      state.productParams = { ...state.productParams, ...action.payload };
    },
    resetProductParams: (state) => {
      state.productsLoaded = false;
      state.productParams = initParams();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductsAsync.pending, (state, _) => {
      state.status = "pendingFetchProducts";
    });
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      productsAdapters.setAll(state, action.payload);
      state.status = "idle";
      state.productsLoaded = true;
    });
    builder.addCase(fetchProductsAsync.rejected, (state, _) => {
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.pending, (state, _) => {
      state.status = "pendingFetchProduct";
    });
    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      productsAdapters.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      console.log(action);
      state.status = "idle";
    });
    builder.addCase(fetchFiltersAsync.pending, (state) => {
      state.status = "pendingFetchFilters";
    });
    builder.addCase(fetchFiltersAsync.fulfilled, (state, action) => {
      state.types = action.payload.types;
      state.brands = action.payload.brands;
      state.filtersFetched = false;
      state.status = "idle";
    });
    builder.addCase(fetchFiltersAsync.rejected, (state) => {
      state.status = "idle";
    });
  },
});

export const productSelectors = productsAdapters.getSelectors<Rootstate>(
  (state) => state.catalog
);

export const { setProductParams, resetProductParams } = catalogSlice.actions;
