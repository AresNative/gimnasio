import { createGenericSlice } from "./firebase";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "trainer" | "member";
  isActive: boolean;
}

const {
  reducer: usersReducer,
  actions: usersActions,
  thunks: usersThunks,
} = createGenericSlice<UserData>("users", "users");

export default usersReducer;
export { usersActions, usersThunks };
