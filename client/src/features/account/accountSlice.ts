import {User} from "../../app/models/user";
import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import {FieldValues} from "react-hook-form";
import agent from "../../app/api/agent";
import {toast} from "react-toastify";

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
            return await agent.Account.login(data);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    });

export const fetchCurrentUser = createAsyncThunk<User>(
    "account/fetchCurrentUser",
    async (_, thunkAPI) => {
        try {
            return await agent.Account.currentUser();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    },
    {
        condition: () => {
            return !!localStorage.getItem("user"); // don't run if localstorage has info
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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUserAsync.rejected, (state, action) => {
            localStorage.removeItem("user");
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
            localStorage.setItem("user", JSON.stringify(state.user));
        });
    }
});

export const {signOut} = accountSlice.actions;