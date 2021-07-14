import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  menuOpen = false;
  pathName = '';
  constructor(private authService: AuthService, private router: Router, public route: ActivatedRoute) {
    this.router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized) {
        this.pathName = data.state.root.firstChild.firstChild.data.pathName;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login').then();
  }

  showMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
