import { HomeComponent } from './Component/home/home.component';
import { ProductsComponent } from './Component/products/products.component';
import { AdminProductsComponent } from './Component/admin-products/admin-products.component';
import { AboutComponent } from './Component/about/about.component';
import { LoginComponent } from './Component/login/login.component';
import { RegisterComponent } from './Component/register/register.component';
import { ProfileComponent } from './Component/profile/profile.component';
import { CartComponent } from './Component/cart/cart.component';
import { ErrorComponent } from './Component/error/error.component';
import { UserAuthService } from './Services/Auth/user-auth.service';
import { AdminAuthService } from './Services/Auth/admin-auth.service';
import { NoneAuthService } from './Services/Auth/none-auth.service';
import { Routes } from '@angular/router';
import { DetailsComponent } from './Component/details/details.component';
import { OrdersComponent } from './Component/orders/orders.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [UserAuthService],
  },
  {path: 'detail/:id', component: DetailsComponent},
  {
    path: 'admin-products',
    component: AdminProductsComponent,
    canActivate: [AdminAuthService],
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AdminAuthService],
  },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent, canActivate: [NoneAuthService] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NoneAuthService],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [UserAuthService],
  },
  { path: 'cart', component: CartComponent, canActivate: [UserAuthService] },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: ErrorComponent },
];
