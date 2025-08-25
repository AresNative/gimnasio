import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { api } from "@/hooks/reducers/api";
import { api_int } from "@/hooks/reducers/api_int";
import { api_landing } from "@/hooks/reducers/api_landing";
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
    [api.reducerPath]: api.reducer,
    [api_int.reducerPath]: api_int.reducer,
    [api_landing.reducerPath]: api_landing.reducer,
  },
  devTools: config.mode !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora estas rutas específicas
        ignoredPaths: ["dropDown.alert.action"],
        // Ignora estas acciones específicas
        ignoredActions: ["dropDown/openAlertReducer"],
      },
    }).concat([api.middleware, api_int.middleware, api_landing.middleware]),
});

setupListeners(store.dispatch);

// ✅ Tipado limpio
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
