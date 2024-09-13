import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class CommonVariablesService {
  constructor() {}

  private brandName = new BehaviorSubject<string>('Café Delight');
  brandName$ = this.brandName.asObservable();

  private user = new BehaviorSubject<User>({
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
  user$ = this.user.asObservable();
  setUser(user: User) {
    this.user.next(user);
  }
}
