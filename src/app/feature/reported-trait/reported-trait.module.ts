import { NgModule } from '@angular/core';
import { ReportedTraitComponent } from './pages/reported-trait/reported-trait.component';
import { ReportedTraitRoutingModule } from './reported-trait-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [ReportedTraitComponent],
  imports: [
    SharedModule,
    ReportedTraitRoutingModule,
    MatSortModule,
    MatPaginatorModule,
    FileUploadModule
  ]
})
export class ReportedTraitModule { }
