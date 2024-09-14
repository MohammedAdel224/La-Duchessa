// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { CartProduct, OrderProduct, Product } from '../model/product.model'; // Adjust path if needed
import { HttpClient } from '@angular/common/http';
import { Order} from '../model/order.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  DB_URL = 'http://localhost:3000/';
  private cartItems: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>([]);
  constructor(private http: HttpClient, private productServes: ProductService) {}
  cart$ = this.cartSubject.asObservable();

  getCartItems(): Product[] {
    return this.cartItems;
  }
  updateCart(id: string, update: { cart: OrderProduct[] }): Observable<any> {
    return this.http.patch(this.DB_URL + 'users/' + id, update);
  }

  MakeOrder(order: Order) {
    return this.http.post(this.DB_URL + 'orders/', order);
  }

  GetImagesForCart(cart: OrderProduct[]): Observable<CartProduct[]> {
    const products$ = this.productServes.getProducts();
    const cart$ = new BehaviorSubject<OrderProduct[]>(cart).asObservable();

    return combineLatest([cart$, products$]).pipe(
      map(([cart, products]) => {
        return cart.map((cartProduct: OrderProduct) => ({
          ...cartProduct,
          image: products.find((product: Product) => product.id === cartProduct.id)!.image
        }));
      })
    );
  }
}
