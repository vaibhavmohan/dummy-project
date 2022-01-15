import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public router: Router) {}

  canActivate(): boolean {
    const userToken = localStorage.getItem('userToken');
    if(!userToken) {
      this.router.navigate(['login']);
      return false;
    }
      return true;
  }
}
