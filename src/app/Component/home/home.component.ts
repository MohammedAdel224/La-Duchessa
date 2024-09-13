import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../Services/product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../model/user.model';
import { CommonVariablesService } from '../../Services/common-variables.service';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  Products: any[] = [];
  categories = [
    { name: 'Drinks', pic: 'Products/coffee cup.jpg' },
    { name: 'Breakfast', pic: 'Products/1.jpeg' },
    { name: 'Lunch', pic: 'Products/3.jpeg' },
    { name: 'Dinner', pic: 'Products/meatproduct.PNG' },
  ];

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
    public productService: ProductService,
    public router: Router,
    private commonVariables: CommonVariablesService,
    private cartService: CartService
  ) {}

  navigateToCategory(category: string) {
    if (this.user.userType === 'none') {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/products'], { queryParams: { category } });
    }
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.Products = data;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
    this.commonVariables.user$.subscribe((user: User) => {
      this.user = user;
      delete this.user.password;
    });
  }

  addToCart(event: Event, product: any) {
    event.stopPropagation();
    this.user.cart.push(product);
    this.cartService.updatecart(this.user.id, { cart: this.user.cart });
  }

  detail(id: string) {
    this.router.navigate(['/detail/' + id]);
  }
}
