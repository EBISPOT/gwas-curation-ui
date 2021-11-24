import { Component } from '@angular/core';
import {ActivationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {

  routePath: string;
  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof ActivationEnd) {
        this.routePath = val.snapshot.routeConfig.path;
      }
    });
  }
}
