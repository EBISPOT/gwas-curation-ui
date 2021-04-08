import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'submissions',
    loadChildren: () => import('./feature/submission/submission.module').then(m => m.SubmissionModule),
    canActivate: [AuthGuard]
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
