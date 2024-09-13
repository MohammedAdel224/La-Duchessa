// import { Component, OnInit } from '@angular/core';
// import { CartService } from '../../Services/cart.service';
// import { CommonModule } from '@angular/common';
// import { User } from '../../model/user.model';
// import { CommonVariablesService } from '../../Services/common-variables.service';
// import { Order } from '../../model/order.model';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ProductService } from '../../Services/product.service';
// import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { Product } from '../../model/product.model';
// import { OrderrService } from '../../Services/orderr.service';
// @Component({
//   selector: 'app-cart',
//   standalone: true,
//   imports: [HttpClientModule, CommonModule, FormsModule],
//   providers: [ProductService],
//   templateUrl: './cart.component.html',
//   styleUrl: './cart.component.css',
// })
// export class CartComponent implements OnInit {
//   userid: string | null = null;
//   Products: Product[] = [];
//   user: User = {
//     id: '',
//     userType: 'none',
//     profilePicture: '',
//     userName: '',
//     email: '',
//     gender: '',
//     address: '',
//     cart: [],
//     order: [],
//   };
//   constructor(
//     public commonVariables: CommonVariablesService,
//     private cartService: CartService,
//     private orderrservice: OrderrService,
//     public prodserve: ProductService,

//     public router: Router,
//     public route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     this.commonVariables.user$.subscribe((user: User) => {
//       this.user = user;
//       delete this.user.password;
//     });
//   }

//   makeorder(order: Order) {
//     this.cartService.MakeOrder(order);
//   }
//   addorder(product: Product) {
//     // this.cartService.addToCart(product);
//     this.user.order.push(product);
//     this.orderrservice.updateorder(this.user.id, { order: this.user.order });
//   }
//   deletefromcart(product: Product) {
//     // Find the index of the product to remove
//     const productIndex = this.user.cart.findIndex((p) => p.id === product.id);

//     // If the product is found in the cart
//     if (productIndex !== -1) {
//       // Remove the product from the cart array
//       this.user.cart.splice(productIndex, 1);

//       // Update the cart in the backend
//       this.cartService.updatecart(this.user.id, { cart: this.user.cart });
//     } else {
//       console.warn('Product not found in cart');
//     }
//   }
//   vieworders() {
//     this.router.navigate(['/orderr']);
//   }
// }
// cart.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../Services/cart.service';
import { OrderrService } from '../../Services/orderr.service';
import { CommonVariablesService } from '../../Services/common-variables.service';
import { User } from '../../model/user.model';
import { Product } from '../../model/product.model';
import { Order } from '../../model/order.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [ProductService],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  userid: string | null = null;
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
    public commonVariables: CommonVariablesService,
    private cartService: CartService,
    private orderrservice: OrderrService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.commonVariables.user$.subscribe((user: User) => {
      this.user = user;
      delete this.user.password;
    });
  }
  goBack(): void {
    this.router.navigate(['/products']);
  }
  makeorder(product: any) {
    if (this.user.id) {
      // Add the product to the user's cart
      this.user.order.push(product);

      // Update the cart on the server
      this.cartService
        .updateCart(this.user.id, { cart: this.user.cart })
        .subscribe({
          next: (response: any) => {
            console.log('Cart updated successfully:', response);
          },
        });
    }
  }
  // addorder() {
  //   if (this.user.id) {
  //     // Add the product to the user's cart
  //     this.user.order.push(this.user.cart);
  //     // Update the cart on the server
  //     this.cartService
  //       .updateCart(this.user.id, { cart: this.user.cart })
  //       .subscribe({
  //         next: (response: any) => {
  //           console.log('Cart updated successfully:', response);
  //         },
  //       });
  //   }

  //   if (this.user.id && this.user.cart.length > 0) {
  //     // Calculate total
  //     const total = this.user.cart.reduce(
  //       (acc, product) => acc + (product.price || 0),
  //       0
  //     );

  //     // Create order object
  //     const order: Order = {
  //       id: this.generateOrderId(), // Generate a unique order ID
  //       userId: this.user.id,
  //       datetime: new Date().toISOString(), // Current date and time
  //       products: this.user.cart,
  //       total: total,
  //       status: 'Pending', // Default status
  //     };

  //     // Create the order in the backend
  //     this.orderrservice.createOrder(order).subscribe({
  //       next: () => {
  //         console.log('Order added successfully');

  //         // Clear the cart
  //         this.user.cart = [];
  //         this.cartService
  //           .updatecart(this.user.id, { cart: this.user.cart })
  //           .subscribe({
  //             next: () => console.log('Cart cleared successfully'),
  //             error: (error) => console.error('Error clearing cart:', error),
  //           });
  //       },
  //       error: (error) => {
  //         console.error('Error adding order:', error);
  //       },
  //     });
  //   } else {
  //     console.error('User ID not found or cart is empty.');
  //   }
  // }

  generateOrderId(): string {
    // Generate a unique order ID
    return 'order-' + Math.random().toString(36).substr(2, 9);
  }

  // deletefromcart(product: Product) {
  //   const productIndex = this.user.cart.findIndex((p) => p.id === product.id);
  //   if (productIndex !== -1) {
  //     this.user.cart.splice(productIndex, 1);
  //     this.cartService
  //       .updatecart(this.user.id, { cart: this.user.cart })
  //       .subscribe({
  //         next: () => console.log('Product removed from cart'),
  //         error: (error) =>
  //           console.error('Error removing product from cart:', error),
  //       });
  //   } else {
  //     console.warn('Product not found in cart');
  //   }
  // }

  vieworders() {
    this.router.navigate(['/orderr']);
  }
}
