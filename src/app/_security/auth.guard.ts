import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.getPermission(state.url)) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  getPermission(url) {
    if (this.authService.loggedIn()) {
      const userToken = this.authService.getPermission();
      return !!(userToken.previledges.includes(url));
    } else {
      return false;
    }
  }

}
