// store/slices/paymentsSlice.ts
import { db } from "@/utils/functions/firebase";
import { Payment } from "@/utils/types/payment";
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

interface PaymentState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  loading: false,
  error: null,
};

// Crear pago
export const createPayment = createAsyncThunk(
  "payments/createPayment",
  async (data: Omit<Payment, "id">, { rejectWithValue }) => {
    try {
      // Generar número de factura único
      const invoiceNumber = `INV-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

      const docRef = await addDoc(collection(db, "payments"), {
        ...data,
        date: Timestamp.fromDate(data.date),
        invoiceNumber,
      });

      return {
        id: docRef.id,
        ...data,
        invoiceNumber,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Obtener todos los pagos
export const fetchPayments = createAsyncThunk(
  "payments/fetchPayments",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(collection(db, "payments"), orderBy("date", "desc"));

      const querySnapshot = await getDocs(q);
      const payments: Payment[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        payments.push({
          id: doc.id,
          memberId: data.memberId,
          memberName: data.memberName,
          membershipId: data.membershipId,
          amount: data.amount,
          date: data.date.toDate(),
          method: data.method,
          status: data.status,
          invoiceNumber: data.invoiceNumber,
          notes: data.notes || "",
        });
      });

      return payments;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Actualizar pago
export const updatePayment = createAsyncThunk(
  "payments/updatePayment",
  async (
    { id, ...data }: Partial<Payment> & { id: string },
    { rejectWithValue }
  ) => {
    try {
      const paymentRef = doc(db, "payments", id);
      const updateData: any = { ...data };

      if (data.date) {
        updateData.date = Timestamp.fromDate(data.date);
      }

      await updateDoc(paymentRef, updateData);

      return { id, ...data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Eliminar pago
export const deletePayment = createAsyncThunk(
  "payments/deletePayment",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "payments", id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createPayment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.payload);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchPayments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updatePayment
      .addCase(updatePayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.payments[index] = {
            ...state.payments[index],
            ...action.payload,
          };
        }
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // deletePayment
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
