import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { PublicationsListComponent } from './pages/publications-list/publications-list.component';

const routes: Routes = [
  {path: '', component: PublicationsListComponent, canActivate: [AuthGuard], data: {pathName: 'Publications'}},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicationRoutingModule { }
