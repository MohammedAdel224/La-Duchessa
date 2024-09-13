import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../../Services/user.service';
import { CommonVariablesService } from '../../../../Services/common-variables.service';
import { Router } from '@angular/router';
import { User } from '../../../../model/user.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-delete-account-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './delete-account-modal.component.html',
})
export class DeleteAccountModalComponent implements OnInit {
  constructor(
    private userService: UserService,
    private commonVariables: CommonVariablesService,
    public router: Router
  ) {}

  @ViewChild('deleteModal') modal!: ElementRef;

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
  ngOnInit() {
    this.commonVariables.user$.subscribe((user: User) => {
      this.user = user;
      delete this.user.password;
    });
  }
  deleteAccountForm = new FormGroup({
    sign: new FormControl('', [
      Validators.required,
      Validators.pattern(/^I want to delete my account$/),
    ]),
    password: new FormControl(''),
  });
  wrongPassword = false;
  deleteSign = 'I want to delete my account';

  get password() {
    return this.deleteAccountForm.controls.password.value;
  }
  get deleteConfirmed() {
    return this.deleteAccountForm.controls.sign.valid;
  }

  deleteAccount(password: string | null) {
    if (this.deleteConfirmed) {
      this.userService
        .DeleteUserById(this.user.id, password)
        .subscribe((response) => {
          if ('error' in response) {
            this.wrongPassword = true;
            setTimeout(() => {
              this.wrongPassword = false;
            }, 5000);
            console.log(response);
            console.log(password);
            console.log(this.user);
          } else {
            const modalElement = this.modal.nativeElement;
            const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
            bootstrapModal.hide();
            this.commonVariables.setUser({
              id: '',
              userType: 'none',
              profilePicture: '',
              userName: '',
              email: '',
              gender: '',
              address: '',
              cart: [],
              order: [],
            });
            this.userService.Signout();
            this.router.navigate(['/login']);
          }
        });
    }
  }
}
