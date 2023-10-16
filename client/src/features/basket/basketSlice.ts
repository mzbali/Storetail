import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import {Basket} from "../../app/models/basket";
import agent from "../../app/api/agent";
import {getCookie} from "../../app/utils/utils";

interface BasketState {
    basket: Basket | null;
    status: string;
}

const initialState: BasketState = {
    basket: null,
    status: "idle",
};


export const fetchBasketAsync = createAsyncThunk<Basket>(
    "basket/fetchBasketAsync", async (_, thunkAPI) => {
        try {
            return await agent.Basket.get();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    },
    {
        condition: () => {
            if (!getCookie("buyerId")) return false;
        }
    }
);
export const addBasketItemAsync = createAsyncThunk<
    Basket,
    { productId: number; quantity: number; name?: string }
>(
    "baskets/addBasketItemAsync",
    async ({productId, quantity = 1}, thunkAPI) => {
        try {
            return await agent.Basket.addItems(productId, quantity);
        } catch (error: any) {
            thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const removeBasketItemAsync = createAsyncThunk<
    void,
    { productId: number; quantity: number; name?: string }
>("baskets/removeBasketItem", async ({productId, quantity}, thunkAPI) => {
    try {
        await agent.Basket.removeItems(productId, quantity);
    } catch (error: any) {
        return thunkAPI.rejectWithValue({error: error.data});
    }
});

const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload;
        },
        resetBasket: (state) => {
            state.basket = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            state.status =
                "pendingAddItem" + action.meta.arg.productId + action.meta.arg.name;
        });

        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            state.status =
                "pendingRemoveItem" + action.meta.arg.productId + action.meta.arg.name;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const findIndex = state.basket?.items.findIndex(
                (i) => i.productId === action.meta.arg.productId
            );
            if (findIndex === -1 || findIndex === undefined) return;
            state.basket!.items[findIndex].quantity -= action.meta.arg.quantity;
            if (state.basket!.items[findIndex].quantity === 0)
                state.basket?.items.splice(findIndex, 1);
            state.status = "idle";
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            state.status = "idle";
            console.log(action.payload);
        });
        builder.addMatcher(isAnyOf(fetchBasketAsync.fulfilled, addBasketItemAsync.fulfilled), (state, action) => {
            state.basket = action.payload;
            state.status = "idle";
        });
        builder.addMatcher(isAnyOf(fetchBasketAsync.rejected, addBasketItemAsync.rejected), (state, action) => {
            state.status = "idle";
            console.log(action.payload);
        });
    },
});

export const {setBasket, resetBasket} = basketSlice.actions;

export default basketSlice;
