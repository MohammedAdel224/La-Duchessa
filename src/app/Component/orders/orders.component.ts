import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../Services/order.service';
import { FormsModule } from '@angular/forms';
import { Order } from '../../model/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  constructor(private ordersService: OrderService) {}

  orders: any[] = [];
  filteredOrders: any[] = [];
  status: string = 'All';
  userName: string = '';
  fromDate: Date = new Date(2020, 1, 1);
  toDate: Date = new Date();
  minDate: Date = new Date(2020, 1, 1);
  maxDate: Date = new Date();

  ngOnInit(): void {
    this.ordersService.GetAllOrdersWithUserInfo().subscribe({
      next: (orders: any[]) => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.orders.sort((a: any, b: any)=> {return (new Date(b.datetime!)).getTime() - (new Date(a.datetime!)).getTime()})
        this.filteredOrders.sort((a: any, b: any)=> {return (new Date(b.datetime!)).getTime() - (new Date(a.datetime!)).getTime()})
      },
    });
  }

  filter() {
    let filtered = this.orders;

    // Filter by status
    if (this.status !== 'All') {
      filtered = filtered.filter((order) => order.status === this.status);
    }

    // Filter by user name
    if (this.userName) {
      filtered = filtered.filter((order) =>
        order.user.userName.toLowerCase().includes(this.userName.toLowerCase())
      );
    }

    console.log('from: ' + this.fromDate);
    console.log('to: ' + this.toDate);
    // Filter date
    filtered = filtered.filter(
      (order) =>
        new Date(this.fromDate) <= new Date(order.datetime) &&
        new Date(order.datetime) <= new Date(this.toDate)
    );

    this.filteredOrders = filtered;
  }

  changeStatus(event: Event, orderId: string, status: string) {
    event.stopPropagation();
    this.ordersService.ChangeStatus(orderId, status).subscribe({
      next: () => {
        this.orders.filter((order) => order.id === orderId)[0].status = status;
        this.filteredOrders.filter((order) => order.id === orderId)[0].status =
          status;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
