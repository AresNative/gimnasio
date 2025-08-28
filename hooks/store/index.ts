// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { EnvConfig } from "@/utils/constants/env.config";

// Reducers existentes
import dropDownReducer from "@/hooks/reducers/drop-down";
import filterDataReducer from "@/hooks/reducers/filter";
import cartReducer from "@/hooks/reducers/cart";
import appReducer from "@/hooks/reducers/app";

// Nuevos reducers (asegúrate de que las rutas sean correctas)
import authReducer from "@/hooks/reducers/auth"; // Ruta ajustada
import checkinsReducer from "@/hooks/reducers/checkins"; // Ruta ajustada
import membersReducer from "@/hooks/reducers/members"; // Añadir miembros
import productsReducer from "@/hooks/reducers/product"; // Añadir productos
import membershipsReducer from "@/hooks/reducers/membership"; // Añadir miembros
import paymentsReducer from "@/hooks/reducers/payment"; // Añadir productos

const config = EnvConfig();

export const store = configureStore({
  reducer: {
    // Reducers existentes
    dropDownReducer, // 🔹 usa un key más limpio
    filterDataReducer,
    cart: cartReducer,
    app: appReducer,

    // Nuevos reducers
    auth: authReducer,
    members: membersReducer,
    products: productsReducer,
    checkins: checkinsReducer,
    memberships: membershipsReducer, // Agregar el nuevo reducer
    payments: paymentsReducer, // Agregar el nuevo reducer
  },
  devTools: true /* : config.mode !== "production" */,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          "dropDown.alert.action",
          "auth.user", // Firebase User no es completamente serializable
          "__rtkq/focused",
          "members.current", // Posibles objetos no serializables
          "products.current",
          "checkins.checkins", // Las fechas no son serializables
          "checkins.activeCheckins",
          "memberships.memberships", // Las fechas no son serializables
          "payments.payments",
        ],
        ignoredActions: [
          "dropDown/openAlertReducer",
          "auth/setUser", // Acción que establece el usuario de Firebase
          "members/setCurrent",
          "products/setCurrent",
          "checkins/registerCheckin/fulfilled", // Contiene objetos Date
          "checkins/registerCheckout/fulfilled",
          "checkins/fetchCheckins/fulfilled",
          "checkins/fetchActiveCheckins/fulfilled",
          "memberships/createMembership/fulfilled", // Contiene objetos Date
          "memberships/fetchMemberships/fulfilled",
          "payments/createPayment/fulfilled",
          "payments/fetchPayments/fulfilled",
        ],
      },
    }),
});

setupListeners(store.dispatch);

// Tipado mejorado
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
