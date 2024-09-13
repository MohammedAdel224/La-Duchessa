import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Services/user.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../../model/user.model';
import { CommonVariablesService } from '../../../Services/common-variables.service';
import { Router } from '@angular/router';
import { DeleteAccountModalComponent } from './delete-account-modal/delete-account-modal.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DeleteAccountModalComponent,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit {
  constructor(
    private userService: UserService,
    private commonVariables: CommonVariablesService,
    public router: Router
  ) {}

  genders = ['Male', 'Female'];
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
  userForm = new FormGroup({
    profilePicture: new FormControl(''),
    email: new FormControl(this.user.email, Validators.email),
    password: new FormControl('', Validators.required),
    newPassword: new FormControl(''),
    confirmNewPassword: new FormControl(''),
    gender: new FormControl(this.user.gender),
    address: new FormControl(this.user.address),
    deleteSign: new FormControl(''),
    deletePassword: new FormControl(''),
  });

  ngOnInit() {
    this.commonVariables.user$.subscribe((user: User) => {
      this.user = user;
      delete this.user.password;
      this.userForm.setControl(
        'email',
        new FormControl(this.user.email, Validators.email)
      );
      this.userForm.setControl('gender', new FormControl(this.user.gender));
      this.userForm.setControl('address', new FormControl(this.user.address));
    });
  }


  get emailIsNotValid() {
    return !this.userForm.controls['email'].valid;
  }
  get confermNewPasswordDoesNotMatchNewPassword() {
    return (
      this.userForm.controls['newPassword'].value !==
      this.userForm.controls['confirmNewPassword'].value
    );
  }

  saveDone: boolean | null = null;
  save(password: string | null) {
    if (
      this.userForm.valid &&
      !this.confermNewPasswordDoesNotMatchNewPassword
    ) {
      let update: any = {
        email: this.userForm.controls['email'].value,
        gender: this.userForm.controls['gender'].value,
        address: this.userForm.controls['address'].value,
      };
      if (this.userForm.controls['newPassword'].value !== '') {
        update['password'] = this.userForm.controls['newPassword'].value;
      }
      this.userService.EditUserById(this.user.id, password, update).subscribe(
        (response) => {
          let res: any = response;
          if ('error' in res) this.saveDone = false;
          else {
            this.saveDone = true;
            setTimeout(() => {
              this.saveDone = null;
            }, 5000);
            this.user.email = this.userForm.controls['email'].value;
            this.user.gender = this.userForm.controls['gender'].value;
            this.user.address = this.userForm.controls['address'].value;
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  reset() {
    this.userForm.patchValue({
      email: this.user.email,
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      gender: this.user.gender,
      address: this.user.address,
    });
  }
}
