import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../environments/environment'

const AUTH_API = environment.AAPURL;;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {

  }

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + ' ', {

    }, httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(AUTH_API + ' ', {

    }, httpOptions);
  }

  loggedIn() {
    return !!this.tokenStorageService.getToken();
  }

  getPermission() {
    let jwtToken = this.tokenStorageService.getToken();
    let decoded = jwt_decode(jwtToken); // TODO: Add jwt-decode to package.json
    if (Date.now() > decoded.exp * 1000) {
      decoded = 'SESSION TIMEOUT';
      alert(decoded);
      this.tokenStorageService.signOut();
      window.location.replace('/login');
    }
    return decoded;
  }
}
