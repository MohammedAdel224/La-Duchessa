import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  genders = ['Male', 'Female'];
  slide = 1;
  validSlide = false;
  usedName: boolean | null = null;
  profilePicture: string | ArrayBuffer | null = 'Images/profile-picture.jpg';

  constructor(private UService: UserService, private router: Router) {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.profilePicture = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('File Error');
    }
  }

  blur(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    selectElement.blur();
    this.inputChange();
  }

  next() {
    this.slide++;
    this.inputChange();
  }
  prev() {
    this.slide--;
    this.inputChange();
  }

  get slide1Valid() {
    return (
      !this.userNameIsNotValid &&
      !this.emailIsNotValid &&
      !this.genderIsNotSelected
    );
  }
  get slide2Valid() {
    return (
      this.registerForm.controls.password.valid &&
      !this.confermPasswordDoesNotMatchPassword
    );
  }
  inputChange() {
    switch (this.slide) {
      case 1:
        this.UService.CheckUserExist(this.userId).subscribe(
          (exist) => (this.usedName = exist)
        );
        this.validSlide = this.slide1Valid && !this.usedName;
        break;
      case 2:
        this.validSlide = this.slide2Valid;
        break;
      case 3:
        this.validSlide = true;
    }
  }

  removeProfilePicture() {
    this.profilePicture = 'Images/profile-picture.jpg';
  }

  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[\s\t]*[a-zA-Z0-9]+([\s][a-zA-Z0-9]+)*[\s\t]*$/),
    ]),
    email: new FormControl('', [Validators.email, Validators.required]),
    gender: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
    profilePicture: new FormControl(''),
  });
  get userNameIsNotValid() {
    return this.registerForm.controls.name.invalid;
  }
  get emailIsNotValid() {
    return this.registerForm.controls.email.invalid;
  }
  get genderIsNotSelected() {
    return (
      this.registerForm.controls.gender.invalid &&
      !this.registerForm.controls.gender.touched
    );
  }
  get addressIsNotEntered() {
    return this.registerForm.controls.address.invalid;
  }

  get userId() {
    return (
      'user-' +
      this.registerForm.controls.name.value
        ?.trim()
        .toLocaleLowerCase()
        .replaceAll(/[\s\t]+/g, '-')
    );
  }
  get userName() {
    return this.registerForm.controls.name.value;
  }
  get email() {
    return this.registerForm.controls.email.value;
  }
  get address() {
    return this.registerForm.controls.address.value;
  }
  get gender() {
    return this.registerForm.controls.gender.value;
  }

  get confermPasswordDoesNotMatchPassword() {
    return (
      this.registerForm.controls.password.value !==
      this.registerForm.controls.confirmPassword.value
    );
  }

  createAccount() {
    if (this.registerForm.valid && !this.confermPasswordDoesNotMatchPassword) {
      let account: User = {
        id: this.userId,
        userType: 'user',
        userName: this.userName,
        email: this.email,
        gender: this.gender,
        address: this.address,
        password: this.registerForm.controls.password.value,
        profilePicture: this.profilePicture,
        profileBackground: '',
        cart: [],
        order: [],
      };
      this.UService.AddUser(account).subscribe(
        (response) => {
          this.router.navigate(['/login']);
          console.log('Account created');
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
}
