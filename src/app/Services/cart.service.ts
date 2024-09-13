// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../model/product.model'; // Adjust path if needed
import { HttpClient } from '@angular/common/http';
import { Order, OrderProduct } from '../model/order.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  DB_URL = 'http://localhost:3002/users';
  private cartItems: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>([]);
  constructor(private myHttp: HttpClient) {}
  cart$ = this.cartSubject.asObservable();

  getCartItems(): Product[] {
    return this.cartItems;
  }
  updateCart(id: string, update: { cart: OrderProduct[] }): Observable<any> {
    return this.myHttp.patch(this.DB_URL + '/' + id, update);
  }

  MakeOrder(order: Order) {
    return this.myHttp.post(this.DB_URL, order);
  }
}
