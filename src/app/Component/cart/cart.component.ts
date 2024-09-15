
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { CommonVariablesService } from '../../Services/common-variables.service';
import { User } from '../../model/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../Services/product.service';
import { CartProduct, OrderProduct } from '../../model/product.model';
import { Order } from '../../model/order.model';
import { OrderService } from '../../Services/order.service';
import { identifierName } from '@angular/compiler';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: CartProduct[] = [];
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

  constructor(
    private commonVariables: CommonVariablesService,
    private cartService: CartService,
    private orderService: OrderService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.commonVariables.user$.subscribe((user: User) => {
      this.user = user;
      delete this.user.password;
    });

    this.cartService.GetImagesForCart(this.user.cart).subscribe({
      next: (cart)=>this.cart = cart
    });
  }

  increaseQuantity(productId: string | null){
    var cartProduct = this.cart.filter((product: CartProduct)=> product.id === productId)[0];
    cartProduct.quantity += 1;

    var userCartProduct = this.user.cart.filter((product: OrderProduct)=> product.id === productId)[0];
    userCartProduct.quantity += 1;

    this.cartService.updateCart(this.user.id, {cart: this.user.cart}).subscribe();
  }

  decreaseQuantity(productId: string | null){
    var cartProduct = this.cart.filter((product: CartProduct)=> product.id === productId)[0];
    cartProduct.quantity = Math.max(1, cartProduct.quantity - 1);

    var userCartProduct = this.user.cart.filter((product: OrderProduct)=> product.id === productId)[0];
    userCartProduct.quantity = Math.max(1, userCartProduct.quantity - 1);

    this.cartService.updateCart(this.user.id, {cart: this.user.cart}).subscribe();
  }

  removeFromCart(productId: string | null){
    this.cart = this.cart.filter((pruduct)=> pruduct.id !== productId);
    this.user.cart = this.user.cart.filter((pruduct)=> pruduct.id !== productId);
    this.cartService.updateCart(this.user.id, {cart: this.user.cart}).subscribe();
  }

  getFormatedDate(date: Date){
    return this.datePipe.transform(date, 'MMMM dd, yyyy hh:mm:ss a')
  }

  makeOrder() {
    let total = 0;
    for(let product of this.user.cart){
      total += product.quantity * product.price;
    }
    const order: Order = {
      userId: this.user.id,
      datetime: this.getFormatedDate(new Date()),
      products: this.user.cart,
      total: total,
      status: "Pending"
    }
    this.orderService.AddOrders(order).subscribe({
      next: ()=>{
        this.cart = [];
        this.user.cart = [];
        this.cartService.updateCart(this.user.id, { cart: [] }).subscribe();
      }
    })
  }
}
