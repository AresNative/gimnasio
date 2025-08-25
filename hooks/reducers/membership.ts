// store/slices/membershipsSlice.ts
import { db } from "@/utils/functions/firebase";
import { Membership } from "@/utils/types/membership";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";

interface MembershipState {
  memberships: Membership[];
  loading: boolean;
  error: string | null;
}

const initialState: MembershipState = {
  memberships: [],
  loading: false,
  error: null,
};

// Crear membresía
export const createMembership = createAsyncThunk(
  "memberships/createMembership",
  async (data: Omit<Membership, "id">, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "memberships"), {
        ...data,
        startDate: Timestamp.fromDate(data.startDate),
        endDate: Timestamp.fromDate(data.endDate),
      });

      return {
        id: docRef.id,
        ...data,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Obtener todas las membresías
export const fetchMemberships = createAsyncThunk(
  "memberships/fetchMemberships",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "memberships"),
        orderBy("startDate", "desc")
      );

      const querySnapshot = await getDocs(q);
      const memberships: Membership[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        memberships.push({
          id: doc.id,
          memberId: data.memberId,
          memberName: data.memberName,
          plan: data.plan,
          price: data.price,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
          status: data.status,
          autoRenew: data.autoRenew || false,
          benefits: data.benefits || [],
        });
      });

      return memberships;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Actualizar membresía
export const updateMembership = createAsyncThunk(
  "memberships/updateMembership",
  async (
    { id, ...data }: Partial<Membership> & { id: string },
    { rejectWithValue }
  ) => {
    try {
      const membershipRef = doc(db, "memberships", id);
      const updateData: any = { ...data };

      if (data.startDate) {
        updateData.startDate = Timestamp.fromDate(data.startDate);
      }
      if (data.endDate) {
        updateData.endDate = Timestamp.fromDate(data.endDate);
      }

      await updateDoc(membershipRef, updateData);

      return { id, ...data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Eliminar membresía
export const deleteMembership = createAsyncThunk(
  "memberships/deleteMembership",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "memberships", id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const membershipsSlice = createSlice({
  name: "memberships",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createMembership
      .addCase(createMembership.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMembership.fulfilled, (state, action) => {
        state.loading = false;
        state.memberships.push(action.payload);
      })
      .addCase(createMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchMemberships
      .addCase(fetchMemberships.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMemberships.fulfilled, (state, action) => {
        state.loading = false;
        state.memberships = action.payload;
      })
      .addCase(fetchMemberships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateMembership
      .addCase(updateMembership.fulfilled, (state, action) => {
        const index = state.memberships.findIndex(
          (m) => m.id === action.payload.id
        );
        if (index !== -1) {
          state.memberships[index] = {
            ...state.memberships[index],
            ...action.payload,
          };
        }
      })
      .addCase(updateMembership.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // deleteMembership
      .addCase(deleteMembership.fulfilled, (state, action) => {
        state.memberships = state.memberships.filter(
          (m) => m.id !== action.payload
        );
      })
      .addCase(deleteMembership.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = membershipsSlice.actions;
export default membershipsSlice.reducer;
