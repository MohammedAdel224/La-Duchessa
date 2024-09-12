import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../Services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../model/user.model';
import { CommonVariablesService } from '../../Services/common-variables.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, RouterModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
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
  BrandName: string = '';

  constructor(
    private userService: UserService,
    private commonVariables: CommonVariablesService
  ) {}

  ngOnInit() {
    this.commonVariables.user$.subscribe((user: User) => {
      this.user = user;
      delete this.user.password;
    });

    this.commonVariables.brandName$.subscribe((brandName: string) => {
      this.BrandName = brandName;
    });
  }

  signout() {
    this.user = {
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
    this.userService.Signout();
  }
}
