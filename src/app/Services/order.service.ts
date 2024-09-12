import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Order } from '../model/order.model';
import { UserService } from './user.service';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private Http: HttpClient,
    private userService: UserService
  ) {}

  DB_URL = 'http://localhost:3000/orders';

  GetAllOrders():Observable<Order[]>{
    return this.Http.get<Order[]>(this.DB_URL);
  }

  GetAllOrdersWithUserInfo(): Observable<any[]> {
    const users$ = this.userService.GetAllUsers();
    const orders$ = this.GetAllOrders();

    return forkJoin([users$, orders$]).pipe(
      map(([users, orders]) => {
        return orders.map((order: Order) => ({
          ...order,
          user: users.find((user: User) => user.id === order.userId)
        }));
      })
    );
  }

  GetOreders(userId: string): Observable<Order[]>{
    return this.Http.get<Order[]>(this.DB_URL+'?userId='+userId);
  }

  AddOrders(order: Order){
    return this.Http.post(this.DB_URL, order);
  }

  ChangeStatus(id: string, status: string){
    return this.Http.patch(this.DB_URL + '/' + id, {status: status});
  }
}
