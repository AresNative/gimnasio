// utils/createGenericSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { db } from "@/utils/functions/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

export interface GenericState<T> {
  items: T[];
  current: T | null;
  loading: boolean;
  error: string | null;
}

export const createGenericSlice = <T extends { id?: string }>(
  name: string,
  collectionName: string
) => {
  const initialState: GenericState<T> = {
    items: [],
    current: null,
    loading: false,
    error: null,
  };

  // ---- Async actions CRUD ----
  const fetchAll = createAsyncThunk(
    `${name}/fetchAll`,
    async (_, { rejectWithValue }) => {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
      } catch (err: any) {
        return rejectWithValue(err.message);
      }
    }
  );

  const fetchById = createAsyncThunk(
    `${name}/fetchById`,
    async (id: string, { rejectWithValue }) => {
      try {
        const docSnap = await getDoc(doc(db, collectionName, id));
        if (!docSnap.exists()) throw new Error("Documento no encontrado");
        return { id: docSnap.id, ...docSnap.data() } as T;
      } catch (err: any) {
        return rejectWithValue(err.message);
      }
    }
  );

  const createItem = createAsyncThunk(
    `${name}/createItem`,
    async (data: Omit<T, "id"> & { id?: string }, { rejectWithValue }) => {
      try {
        const ref = doc(collection(db, collectionName));
        await setDoc(ref, data);
        return { id: ref.id, ...data } as T;
      } catch (err: any) {
        return rejectWithValue(err.message);
      }
    }
  );

  // ---- Slice base ----
  const slice = createSlice({
    name,
    initialState,
    reducers: {
      clearError: (state: any) => {
        state.error = null;
      },
      setCurrent: (state: any, action: PayloadAction<T | null>) => {
        state.current = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        // fetchAll
        .addCase(fetchAll.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchAll.fulfilled, (state: any, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(fetchAll.rejected, (state: any, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        // fetchById
        .addCase(fetchById.fulfilled, (state: any, action) => {
          state.current = action.payload;
        })
        // createItem
        .addCase(createItem.fulfilled, (state: any, action) => {
          state.items.push(action.payload);
        });
    },
  });

  return {
    reducer: slice.reducer,
    actions: slice.actions,
    thunks: { fetchAll, fetchById, createItem },
  };
};
