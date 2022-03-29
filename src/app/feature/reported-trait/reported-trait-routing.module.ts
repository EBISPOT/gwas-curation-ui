import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { ReportedTraitComponent } from './pages/reported-trait/reported-trait.component';

const routes: Routes = [
  {path: '', component: ReportedTraitComponent, canActivate: [AuthGuard], data: {pathName: 'Reported traits'}},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportedTraitRoutingModule {
}
