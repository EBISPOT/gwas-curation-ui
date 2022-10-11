import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { StudySearchComponent } from './pages/study-search/study-search.component';

const routes: Routes = [
  {path: '', component: StudySearchComponent, canActivate: [AuthGuard], data: {pathName: 'Studies'}},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudyRoutingModule {
}
