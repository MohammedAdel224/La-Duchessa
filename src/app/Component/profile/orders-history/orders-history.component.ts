import { Component } from '@angular/core';
import { User } from '../../../model/user.model';
import { CommonVariablesService } from '../../../Services/common-variables.service';
import { OrderService } from '../../../Services/order.service';
import { Order } from '../../../model/order.model';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [],
  templateUrl: './orders-history.component.html',
  styleUrl: './orders-history.component.css',
})
export class OrdersHistoryComponent {
  constructor(
    private commonVariables: CommonVariablesService,
    private ordersService: OrderService
  ) {}
  orders: any = [];
  user: User = {
    id: '',
    userType: 'none',
    profilePicture: '',
    userName: '',
    email: '',
    gender: '',
    address: '',
    cart: [],
    order: [],
  };
  ngOnInit() {
    this.commonVariables.user$.subscribe((user: User) => {
      this.user = user;
      delete this.user.password;
    });
    this.ordersService.GetOreders(this.user.id).subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.orders.sort((a: Order, b: Order)=> {return (new Date(b.datetime!)).getTime() - (new Date(a.datetime!)).getTime()})
      },
    });
  }

  cancelOrder(event: Event, orderId: string) {
    event.stopPropagation();
    this.ordersService.ChangeStatus(orderId, 'Canceled').subscribe({
      next: () => {
        this.orders.filter((order: Order) => order.id === orderId)[0].status =
          'Canceled';
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
