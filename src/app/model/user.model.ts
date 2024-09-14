import { Order } from "./order.model";
import { OrderProduct } from "./product.model";

export interface User {
  id: string;
  userType: string;
  profilePicture: string | ArrayBuffer | null;
  userName: string | null;
  email: string | null;
  password?: string | null;
  gender: string | null;
  address: string | null;
  cart: OrderProduct[];
  order: Order[];
}
