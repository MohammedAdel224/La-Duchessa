import { Component, OnInit } from '@angular/core';
import { CommonVariablesService } from '../../Services/common-variables.service';
import { User } from '../../model/user.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  constructor(private commonVariables: CommonVariablesService) {}
  ngOnInit() {
    this.commonVariables.user$.subscribe((user: User) => {
      this.user = user;
      delete this.user.password;
    });

    this.commonVariables.brandName$.subscribe((brandName: string) => {
      this.BrandName = brandName;
    });
  }

  BrandName: string = 'Brand Name';
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

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
