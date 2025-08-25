// store/slices/membersSlice.ts

import { createGenericSlice } from "./firebase";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: "admin" | "trainer" | "member";
  isActive: boolean;
  createdAt?: Date;
}

const {
  reducer: membersReducer,
  actions: membersActions,
  thunks: membersThunks,
} = createGenericSlice<Member>("members", "members");

export default membersReducer;
export { membersActions, membersThunks };
