import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import jwt_decode from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService, private router: Router) {

  }

  loggedIn() {
    return !!this.tokenStorageService.getToken();
  }

  isCurator() {
    return this.getDecodedToken().domains.indexOf('self.GWAS_Curator') > -1;
  }

  getDecodedToken() {
    const jwtToken = this.tokenStorageService.getToken();
    let decoded = jwt_decode(jwtToken);
    if (Date.now() > decoded.exp * 1000) {
      decoded = 'SESSION TIMEOUT';
      alert(decoded);
      this.tokenStorageService.signOut();
      this.router.navigateByUrl('/login').then();
    }
    return decoded;
  }

  login() {
    const width = 650;
    const height = 1000;
    let left = -1;
    let top = -1;

    if (left < 0) {
      const screenWidth = window.screen.width;
      if (screenWidth > width) {
        left = Math.round((screenWidth - width) / 2);
      }
    }
    if (top < 0) {
      const screenHeight = window.screen.height;
      if (screenHeight > height) {
        top = Math.round((screenHeight - height) / 2);
      }
    }

    const windowOptions = [
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`,
      'personalbar=no',
      'toolbar=no',
      'scrollbars=yes',
      'resizable=yes',
      'directories=no',
      'location=no',
      'menubar=no',
      'titlebar=no',
      'toolbar=no'
    ];
    const loginWindow = window.open(environment.AAPURL + '/sso?from=' + location.origin + '&ttl=180',
      'Sign in to Elixir', windowOptions.join(','));

    if (loginWindow) {
      loginWindow.focus();
    }
    return loginWindow;
  }

  saveToken(token: string) {
    this.tokenStorageService.saveToken(token);
  }

  logout() {
    this.tokenStorageService.signOut();
  }
}
