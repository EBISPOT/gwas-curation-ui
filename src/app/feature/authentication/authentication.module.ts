import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { SharedModule } from '../../shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    AuthenticationRoutingModule,
    SharedModule
  ]
})
export class AuthenticationModule { }
