import { Component, OnInit } from '@angular/core';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { OrdersHistoryComponent } from './orders-history/orders-history.component';
import { UserService } from '../../Services/user.service';
import { CommonVariablesService } from '../../Services/common-variables.service';
import { Router } from '@angular/router';
import { User } from '../../model/user.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    EditProfileComponent,
    OrdersHistoryComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  constructor(
    private userService: UserService,
    private commonVariables: CommonVariablesService,
    public router: Router
  ) {}

  ngOnInit() {
    this.commonVariables.user$.subscribe((user: User) => {
      this.user = user;
      delete this.user.password;
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.user.profilePicture = reader.result;
        this.userService.ChangeUserProfilePicture(this.user.id, this.user.profilePicture).subscribe();
      };
      reader.readAsDataURL(file);
    } else {
      console.error('File Error');
    }
  }

  removeProfilePicture() {
    this.user.profilePicture = 'Images/profile-picture.jpg';
    this.userService.ChangeUserProfilePicture(this.user.id, this.user.profilePicture).subscribe();
  }

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

  profileImageForm = new FormGroup({
    profilePicture: new FormControl('')
  });
}
