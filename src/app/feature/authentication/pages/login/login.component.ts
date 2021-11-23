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
  bgImage: string;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.loggedIn()) { this.router.navigateByUrl('/').then(); }
    this.randomBgImage();
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

  randomBgImage() {
    let images: string[];
    images = ['bg-4.jpg', 'bg-1.jpg', 'bg-2.jpg', 'bg-3.jpg', 'bg-4.jpg'];
    const min = 0;
    const max = 5;
    const num = Math.floor(Math.random() * (max - min + 1) + min);
    this.bgImage = `assets/images/${images[num]}`;
  }

}
