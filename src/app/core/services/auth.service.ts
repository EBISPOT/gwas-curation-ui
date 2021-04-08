import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {

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
      window.location.replace('/login');
    }
    return decoded;
  }
}
