import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../Services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../model/product.model'; // Adjust path accordingly
import { CartService } from '../../Services/cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../model/user.model';
import { CommonVariablesService } from '../../Services/common-variables.service';
import { Order, OrderProduct } from '../../model/order.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [ProductService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  searchTerm: string = '';
  Products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string = '';
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
    private cartService: CartService,

    public commonVariables: CommonVariablesService,
    public prodserve: ProductService,

    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.commonVariables.user$.subscribe((user: User) => {
      this.user = user;
      delete this.user.password;
    });
    this.prodserve.getProducts().subscribe({
      next: (data: Product[]) => {
        this.Products = data;
        this.route.queryParams.subscribe((params) => {
          this.category = params['category'] || '';
          this.filterProducts();
        });
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  filterProducts() {
    let filtered = this.Products;

    // Filter by category
    if (this.category) {
      filtered = filtered.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase() === this.category.toLowerCase()
      );
    }

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.details &&
          product.details.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredProducts = filtered;
  }

  addToCart(product: Product) {
    var cartProduct = this.user.cart.filter((orderProduct: OrderProduct)=> orderProduct.id == product.id);
    if(cartProduct.length !== 0){
      cartProduct[0].quantity += 1;
    }
    else{
      this.user.cart.push({id: product.id, name: product.name, price: product.price, quantity: 1});
    }
    this.cartService.updateCart(this.user.id, {cart: this.user.cart});
  }

  viewCart() {
    this.router.navigate(['/cart']);
  }
  detail(id: string | null) {
    this.router.navigate(['/detail/' + id]);
  }
}
