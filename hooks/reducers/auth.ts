// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";
import { AppDispatch } from "../store";
import { auth } from "@/utils/functions/firebase";
import { setLocalStorageItem } from "@/utils/functions/local-storage";

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

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const result: UserCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      console.log(result);
      setLocalStorageItem("token", result.providerId);
      return result.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

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
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;

export const initAuthListener = (dispatch: AppDispatch) => {
  onAuthStateChanged(auth, (user) => {
    dispatch(setUser(user));
  });
};
