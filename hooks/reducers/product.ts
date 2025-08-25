// hooks/reducers/users.ts

import { createGenericSlice } from "./firebase";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const {
  reducer: productsReducer,
  actions: productsActions,
  thunks: productsThunks,
} = createGenericSlice<Product>("products", "products");

export default productsReducer;
export { productsActions, productsThunks };
