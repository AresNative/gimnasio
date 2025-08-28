// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  IdTokenResult,
} from "firebase/auth";
import { AppDispatch } from "../store";
import { auth } from "@/utils/functions/firebase";
import {
  removeFromLocalStorage,
  setLocalStorageItem,
} from "@/utils/functions/local-storage";

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
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

      // Obtener el token actualizado
      const idTokenResult: IdTokenResult = await result.user.getIdTokenResult();
      const token = idTokenResult.token;

      setLocalStorageItem("token", token);
      return { user: result.user, token };
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
      removeFromLocalStorage("token");
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
    setAuthState: (
      state,
      action: PayloadAction<{ user: User | null; token: string | null }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
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
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, setAuthState } = authSlice.actions;
export default authSlice.reducer;

export const initAuthListener = (dispatch: AppDispatch) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Obtener el token actualizado
      const idTokenResult = await user.getIdTokenResult();
      const token = idTokenResult.token;
      setLocalStorageItem("token", token);
      dispatch(setAuthState({ user, token }));
    } else {
      removeFromLocalStorage("token");
      dispatch(setAuthState({ user: null, token: null }));
    }
  });
};
