import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubmissionListComponent } from './pages/submission-list/submission-list.component';
import { SubmissionDetailsComponent } from './pages/submission-details/submission-details.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {path: '', component: SubmissionListComponent, canActivate: [AuthGuard], data: {pathName: 'Submissions'}},
  {path: ':id', component: SubmissionDetailsComponent, canActivate: [AuthGuard], data: {pathName: 'Submission details'}},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmissionRoutingModule {
}
