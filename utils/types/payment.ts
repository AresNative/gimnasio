// types/payment.ts
export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  membershipId: string;
  amount: number;
  date: Date;
  method: "cash" | "card" | "transfer" | "other";
  status: "pending" | "completed" | "failed" | "refunded";
  invoiceNumber?: string;
  notes?: string;
}
