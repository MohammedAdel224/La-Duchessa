import { Component, OnInit } from '@angular/core';
import { OrderProduct, Product } from '../../model/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { CartService } from '../../Services/cart.service';
import { CommonVariablesService } from '../../Services/common-variables.service';
import { User } from '../../model/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [ProductService],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  product: Product | any;

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
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private commonVariables: CommonVariablesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.productService.getprodid(id).subscribe((product) => {
        this.product = product;
      });
    });

    this.commonVariables.user$.subscribe((user) => {
      this.user = user;
    });
  }

  addToCart(product: Product) {
    var cartProduct = this.user.cart.filter((orderProduct: OrderProduct)=> orderProduct.id == product.id);
    if(cartProduct.length !== 0){
      cartProduct[0].quantity += 1;
    }
    else{
      this.user.cart.push({id: product.id, name: product.name, price: product.price, quantity: 1});
    }
    this.cartService.updateCart(this.user.id, {cart: this.user.cart}).subscribe();
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
