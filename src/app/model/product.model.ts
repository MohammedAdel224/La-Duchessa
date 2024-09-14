export interface Product {
  category: string | null;
  id: string | null;
  name: string | null;
  title: string | null;
  details: string | null;
  price: number;
  image: string | ArrayBuffer | null;
}

export interface OrderProduct {
  id: string | null;
  name: string | null;
  price: number;
  quantity: number;
}

export interface CartProduct {
  id: string | null;
  name: string | null;
  price: number;
  quantity: number;
  image: string | ArrayBuffer | null;
}
