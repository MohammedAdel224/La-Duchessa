export interface Order {
  id: string;
  userId: string;
  datetime: string;
  products: OrderProduct[];
  total: number;
  status: string;
}

export interface OrderProduct {
  id: string | null;
  name: string | null;
  price: number | null;
  quantity: number;
}
