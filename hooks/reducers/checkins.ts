// store/slices/checkinsSlice.ts
import { db } from "@/utils/functions/firebase";
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
} from "firebase/firestore";

export interface Checkin {
  id: string;
  memberId: string;
  memberName: string;
  checkInTime: Date;
  checkOutTime: Date | null;
  duration: number | null; // en minutos
}

interface CheckinState {
  checkins: Checkin[];
  activeCheckins: Checkin[];
  loading: boolean;
  error: string | null;
}

const initialState: CheckinState = {
  checkins: [],
  activeCheckins: [],
  loading: false,
  error: null,
};

// Registrar entrada
export const registerCheckin = createAsyncThunk(
  "checkins/registerCheckin",
  async (
    { memberId, memberName }: { memberId: string; memberName: string },
    { rejectWithValue }
  ) => {
    try {
      const docRef = await addDoc(collection(db, "checkins"), {
        memberId,
        memberName,
        checkInTime: Timestamp.now(),
        checkOutTime: null,
        duration: null,
      });

      const newCheckin = {
        id: docRef.id,
        memberId,
        memberName,
        checkInTime: new Date(),
        checkOutTime: null,
        duration: null,
      };

      return newCheckin;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Registrar salida
export const registerCheckout = createAsyncThunk(
  "checkins/registerCheckout",
  async (memberId: string, { rejectWithValue }) => {
    try {
      // Buscar el check-in activo del miembro
      const q = query(
        collection(db, "checkins"),
        where("memberId", "==", memberId),
        where("checkOutTime", "==", null)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("No se encontró un check-in activo para este miembro");
      }

      const checkinDoc = querySnapshot.docs[0];
      const checkinData = checkinDoc.data();
      const checkInTime = checkinData.checkInTime.toDate();
      const now = new Date();
      const duration = Math.floor(
        (now.getTime() - checkInTime.getTime()) / 60000
      ); // minutos

      // Actualizar el documento con la hora de salida y duración
      await updateDoc(doc(db, "checkins", checkinDoc.id), {
        checkOutTime: Timestamp.now(),
        duration,
      });

      return {
        id: checkinDoc.id,
        memberId,
        memberName: checkinData.memberName,
        checkInTime: checkInTime,
        checkOutTime: now,
        duration,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Obtener todos los check-ins
export const fetchCheckins = createAsyncThunk(
  "checkins/fetchCheckins",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "checkins"),
        orderBy("checkInTime", "desc")
      );

      const querySnapshot = await getDocs(q);
      const checkins: Checkin[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        checkins.push({
          id: doc.id,
          memberId: data.memberId,
          memberName: data.memberName,
          checkInTime: data.checkInTime.toDate(),
          checkOutTime: data.checkOutTime ? data.checkOutTime.toDate() : null,
          duration: data.duration || null,
        });
      });

      return checkins;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Obtener check-ins activos (sin salida)
export const fetchActiveCheckins = createAsyncThunk(
  "checkins/fetchActiveCheckins",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "checkins"),
        where("checkOutTime", "==", null),
        orderBy("checkInTime", "desc")
      );

      const querySnapshot = await getDocs(q);
      const activeCheckins: Checkin[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        activeCheckins.push({
          id: doc.id,
          memberId: data.memberId,
          memberName: data.memberName,
          checkInTime: data.checkInTime.toDate(),
          checkOutTime: null,
          duration: null,
        });
      });

      return activeCheckins;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const checkinsSlice = createSlice({
  name: "checkins",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // registerCheckin
      .addCase(registerCheckin.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerCheckin.fulfilled, (state, action) => {
        state.loading = false;
        state.checkins.unshift(action.payload);
        state.activeCheckins.unshift(action.payload);
      })
      .addCase(registerCheckin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // registerCheckout
      .addCase(registerCheckout.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerCheckout.fulfilled, (state, action) => {
        state.loading = false;

        // Actualizar el check-in en la lista general
        const index = state.checkins.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.checkins[index] = action.payload;
        }

        // Eliminar de check-ins activos
        state.activeCheckins = state.activeCheckins.filter(
          (c) => c.id !== action.payload.id
        );
      })
      .addCase(registerCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchCheckins
      .addCase(fetchCheckins.fulfilled, (state, action) => {
        state.checkins = action.payload;
      })
      .addCase(fetchCheckins.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // fetchActiveCheckins
      .addCase(fetchActiveCheckins.fulfilled, (state, action) => {
        state.activeCheckins = action.payload;
      })
      .addCase(fetchActiveCheckins.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = checkinsSlice.actions;
export default checkinsSlice.reducer;
