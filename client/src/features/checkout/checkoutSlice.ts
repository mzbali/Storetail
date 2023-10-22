import {Address, Order, OrderValue} from "../../app/models/order";
import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import {resetBasket} from "../basket/basketSlice";

interface OrderState {
    orders: Order[] | null;
    status: string;
    orderNumber: number | null;
    shippingAddress: Address | null;
}

const initialState: OrderState = {
    orders: null,
    status: "idle",
    orderNumber: null,
    shippingAddress: null
};

export const fetchOrdersAsync = createAsyncThunk<Order[]>(
    "order/fetchOrdersAsync", async (_, thunkAPI) => {
        try {
            return await agent.Order.orders();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    },
    {
        condition: () => {
            return !!localStorage.getItem("user");
        }
    }
);

export const fetchOrderAsync = createAsyncThunk<Order, number>(
    "order/fetchOrderAsync", async (id, thunkAPI) => {
        try {
            return await agent.Order.order(id);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    },
    {
        condition: () => {
            return !!localStorage.getItem("user");
        }
    }
);

export const createOrderAsync = createAsyncThunk<number, OrderValue>(
    "order/createOrderAsync", async (orderValue, thunkAPI) => {
        try {
            const orderNumber = await agent.Order.createOrder(orderValue);
            if (orderNumber) {
                thunkAPI.dispatch(resetBasket());
            }
            return orderNumber;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    },
    {
        condition: () => {
            return !!localStorage.getItem("user");
        }
    }
);

const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        resetOrders: (state) => {
            state = initialState;
        }
    },
    extraReducers: builder => {
        builder.addCase(createOrderAsync.fulfilled, (state, action) => {
            state.orderNumber = action.payload;
            state.status = "idle";
        });
        builder.addCase(fetchOrdersAsync.fulfilled, (state, action) => {
            state.status = "idle";
            state.orders = action.payload;
        });
        builder.addCase(fetchOrderAsync.fulfilled, (state, action) => {
            state.status = "idle";
            if (state.orders === null) {
                state.orders = [];
            }
            const findIndex = state.orders.findIndex(o => o.id === action.payload.id);
            if (findIndex !== -1) {
                state.orders[findIndex] = action.payload;
            } else state.orders = [...state.orders, action.payload];

        });
        builder.addMatcher(isAnyOf(fetchOrderAsync.pending, fetchOrdersAsync.pending, createOrderAsync.pending), (state, action) => {
            state.status = "pending";
        });
        builder.addMatcher(isAnyOf(fetchOrderAsync.rejected, fetchOrdersAsync.rejected, createOrderAsync.rejected), (state, action) => {
            state.status = "idle";
            console.log(action.payload);
        });
    }
});

export const {resetOrders} = checkoutSlice.actions;
export default checkoutSlice;