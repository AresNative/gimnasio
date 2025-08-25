import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { EnvConfig } from "@/utils/constants/env.config";

import dropDownReducer from "@/hooks/reducers/drop-down";
import filterDataReducer from "@/hooks/reducers/filter";

import cartReducer from "@/hooks/slices/cart";
import appReducer from "@/hooks/slices/app";
import authReducer from "@/hooks/reducers/auth"; // <-- agrega tu authSlice basado en genericSlice

const config = EnvConfig();

export const store = configureStore({
  reducer: {
    dropDownReducer, // 🔹 usa un key más limpio
    filterDataReducer,
    cart: cartReducer,
    app: appReducer,
    auth: authReducer, // 🔹 tu slice de auth
  },
  devTools: config.mode !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora estas rutas específicas
        ignoredPaths: ["dropDown.alert.action", "__rtkq/focused"],
        // Ignora estas acciones específicas
        ignoredActions: ["dropDown/openAlertReducer", "auth.user"],
      },
    }).concat([]),
});

setupListeners(store.dispatch);

// ✅ Tipado limpio
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
