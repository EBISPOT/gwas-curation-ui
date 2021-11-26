import { NgModule } from '@angular/core';
import { EfoTraitsComponent } from './pages/efo-traits/efo-traits.component';
import { SharedModule } from '../../shared/shared.module';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FileUploadModule } from 'ng2-file-upload';
import { EfoTraitRoutingModule } from './efo-trait-routing.module';



@NgModule({
  declarations: [EfoTraitsComponent],
  imports: [
    SharedModule,
    EfoTraitRoutingModule,
    MatSortModule,
    MatPaginatorModule,
    FileUploadModule
  ]
})
export class EfoTraitModule { }
