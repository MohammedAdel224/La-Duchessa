import { Component, OnInit } from '@angular/core';
import { Product } from '../../model/product.model';
import { User } from '../../model/user.model';
import { CommonVariablesService } from '../../Services/common-variables.service';
import { CartService } from '../../Services/cart.service';
import { OrderrService } from '../../Services/orderr.service';
import { ProductService } from '../../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-orderr',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [ProductService],
  templateUrl: './orderr.component.html',
  styleUrl: './orderr.component.css',
})
export class OrderrComponent implements OnInit {
  userid: string | null = null;
  Products: Product[] = [];
  user: User = {
    id: '',
    userType: 'none',
    profilePicture: '',
    profileBackground: '',
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
    public prodserve: ProductService,

    public router: Router,
    public route: ActivatedRoute
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
  cancelorder(product: Product) {
    // Find the index of the product to remove
    const productIndex = this.user.order.findIndex((p) => p.id === product.id);

    // If the product is found in the cart
    if (productIndex !== -1) {
      // Remove the product from the cart array
      this.user.order.splice(productIndex, 1);

      // Update the cart in the backend
      this.orderrservice.updateorder(this.user.id, { order: this.user.cart });
    } else {
      console.warn('Product not found in cart');
    }
  }
}
