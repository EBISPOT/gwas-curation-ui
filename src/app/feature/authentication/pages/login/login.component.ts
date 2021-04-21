import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  window: any;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.loggedIn()) { this.router.navigateByUrl('/').then(); }
  }

  login() {
    this.window = this.authService.login();
  }

  @HostListener('window:message', ['$event'])
  handleLogin(event) {
    if (event.origin === environment.AAPURL) {
      this.authService.saveToken(event.data);
      this.window.close();
      this.router.navigateByUrl('/').then();
    }
  }

}
