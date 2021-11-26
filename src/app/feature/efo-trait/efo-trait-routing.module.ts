import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { EfoTraitsComponent } from './pages/efo-traits/efo-traits.component';

const routes: Routes = [
  {path: '', component: EfoTraitsComponent, canActivate: [AuthGuard], data: {pathName: 'EFO traits'}},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EfoTraitRoutingModule {
}
