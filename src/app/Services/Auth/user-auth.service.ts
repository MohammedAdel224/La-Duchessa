import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService implements CanActivate {

  constructor(private UService: UserService, private router: Router) { }

  canActivate(): boolean {
    if(this.UService.IsAuthenticated() && this.UService.UserType == "user") return true;
    this.router.navigate(["/login"]);
    return false;
  }
}
