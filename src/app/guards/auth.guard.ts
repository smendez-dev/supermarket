import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router : Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.verifyLogin();
  }

  verifyLogin(): boolean{
    if(!this.isLoggedIn()){
        this.router.navigate(['/login']);
        return false;
    }
    return true;
  }

  public isLoggedIn(): boolean{
    return localStorage.getItem('username') ? true : false;
  }
}
