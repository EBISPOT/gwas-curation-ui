import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { PublicationsListComponent } from './pages/publications-list/publications-list.component';
import { ImportPublicationComponent } from './pages/import-publication/import-publication.component';

const routes: Routes = [
  {path: '', component: PublicationsListComponent, canActivate: [AuthGuard], data: {pathName: 'Publications'}},
  {path: 'import', component: ImportPublicationComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicationRoutingModule { }
