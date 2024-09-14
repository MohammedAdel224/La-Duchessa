import { OrderProduct } from "./product.model";

export interface Order {
  id: string;
  userId: string;
  datetime: string;
  products: OrderProduct[];
  total: number;
  status: string;
}
