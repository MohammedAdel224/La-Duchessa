import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService implements CanActivate{

  constructor(private UService: UserService, private router: Router) { }

  canActivate(): boolean {
    if(this.UService.IsAuthenticated() && this.UService.UserType == "admin") return true;
    this.router.navigate(["/login"]);
    return false;
  }
}
