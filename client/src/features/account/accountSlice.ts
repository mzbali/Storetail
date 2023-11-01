import {User} from "../../app/models/user";
import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import {FieldValues} from "react-hook-form";
import agent from "../../app/api/agent";
import {toast} from "react-toastify";
import {setBasket} from "../basket/basketSlice";
import router from "../../app/router/Routes";

interface accountState {
    user: User | null;
}

const initialState: accountState = {
    user: null
};

export const loginUserAsync = createAsyncThunk<User, FieldValues>(
    "account/loginUser",
    async (data, thunkAPI) => {
        try {
            const userDto: User = await agent.Account.login(data);
            const {basket, ...user} = userDto;
            if (basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    });

export const fetchCurrentUser = createAsyncThunk<User>(
    "account/fetchCurrentUser",
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(localStorage.getItem("user")!));
        try {
            const userDto = await agent.Account.currentUser();
            const {basket, ...user} = userDto;
            if (basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem("user", JSON.stringify(user));
            return user;

        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem("user"))
                return false;// don't run if localstorage has info
        }
    }
);


export const accountSlice = createSlice({
    name: "account",
    initialState: initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem("user");
            router.navigate("/");
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUserAsync.rejected, (state, action) => {
            state.user = null;
            console.log(action.payload);
        });
        builder.addCase(fetchCurrentUser.rejected, (state,) => {
            state.user = null;
            localStorage.removeItem("user");
            toast.error("Session expired - please login again");
        });
        builder.addMatcher(isAnyOf(loginUserAsync.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            state.user = action.payload;
        });
    }
});

export const {signOut, setUser} = accountSlice.actions;