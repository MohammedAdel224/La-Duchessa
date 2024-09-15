import { OrderProduct } from "./product.model";

export interface Order {
  id?: string;
  userId: string;
  datetime: string | null;
  products: OrderProduct[];
  total: number;
  status: "Pending" | "Accepted" | "Rejected" | "Canceled";
}
