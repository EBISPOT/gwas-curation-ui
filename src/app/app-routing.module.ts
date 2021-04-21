import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'submissions',
    loadChildren: () => import('./feature/submission/submission.module').then(m => m.SubmissionModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./feature/authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {path: '', redirectTo: 'submissions', pathMatch: 'full'},
  {path: '**', redirectTo: 'submissions'}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
