// drop-down.ts (slice actualizado)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// Tipos para las alertas
type AlertIcon = "archivo" | "alert";
type AlertType = "success" | "error" | "warning" | "completed" | "info";

// Interfaz modificada para no almacenar funciones
interface BaseAlertProps {
  title?: string;
  message: string;
  buttonText?: string;
  icon: AlertIcon;
  type: AlertType;
  duration?: number;
  actionType?: string; // En lugar de una función, usamos un identificador
  actionPayload?: any; // Datos para la acción si son necesarios
}

interface ModalState {
  [modalName: string]: boolean;
}

interface DropDownState {
  alert: BaseAlertProps;
  modals: ModalState;
  cuestionActivate: unknown;
}

// Estado inicial sin funciones
const initialAlertState: BaseAlertProps = {
  title: "",
  message: "",
  buttonText: "",
  type: "completed",
  duration: 3000,
  icon: "archivo",
  // action y actionPayload son opcionales, así que no los incluimos por defecto
};

const initialState: DropDownState = {
  alert: initialAlertState,
  modals: {},
  cuestionActivate: null,
};

// Creación del slice
export const dropDownSlice = createSlice({
  name: "dropDown",
  initialState,
  reducers: {
    openAlertReducer: (state, action: PayloadAction<BaseAlertProps>) => {
      state.alert = {
        ...action.payload,
        duration: action.payload.duration ?? 3000,
      };
    },
    clearAlert: (state) => {
      state.alert = initialAlertState;
    },
    openModalReducer: (state, action: PayloadAction<{ modalName: string }>) => {
      const { modalName } = action.payload;
      Object.keys(state.modals).forEach((key) => {
        state.modals[key] = false;
      });
      state.modals[modalName] = true;
    },
    closeModalReducer: (
      state,
      action: PayloadAction<{ modalName: string }>
    ) => {
      const { modalName } = action.payload;
      state.modals[modalName] = false;
    },
    toggleModalReducer: (
      state,
      action: PayloadAction<{ modalName: string }>
    ) => {
      const { modalName } = action.payload;
      state.modals[modalName] = !state.modals[modalName];
    },
  },
});

export const {
  openAlertReducer,
  clearAlert,
  openModalReducer,
  closeModalReducer,
  toggleModalReducer,
} = dropDownSlice.actions;
export default dropDownSlice.reducer;
