// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { auth } from "@/utils/functions/firebase";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
} from "firebase/auth";

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

// ---- Async actions para login / logout ----
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (
        { email, password }: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            return res.user;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
    await signOut(auth);
    return null;
});

// ---- Slice (inspirado en createGenericSlice, pero adaptado) ----
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;

// ---- Inicializador: mantiene sesión persistida ----
export const initAuthListener = (dispatch: any) => {
    onAuthStateChanged(auth, (user) => {
        dispatch(setUser(user));
    });
};
