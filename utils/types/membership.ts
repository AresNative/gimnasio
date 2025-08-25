// types/membership.ts
export interface Membership {
  id: string;
  memberId: string;
  memberName: string;
  plan: string;
  price: number;
  startDate: Date;
  endDate: Date;
  status: "active" | "expired" | "cancelled";
  autoRenew: boolean;
  benefits: string[];
}
