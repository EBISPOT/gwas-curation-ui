import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

const TOKEN_KEY = 'id_token';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(private router: Router, private dialog: MatDialog) {
  }

  signOut() {
    setTimeout('alert("SESSION EXPIRED")', 1);
    this.dialog.closeAll();
    this.router.navigateByUrl('/login').then();
    window.localStorage.removeItem(TOKEN_KEY);
  }

  public saveToken(token: string) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

}
