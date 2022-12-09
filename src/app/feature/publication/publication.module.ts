import { NgModule } from '@angular/core';
import { PublicationsListComponent } from './pages/publications-list/publications-list.component';
import { SharedModule } from '../../shared/shared.module';
import { PublicationRoutingModule } from './publication-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [PublicationsListComponent],
  imports: [
    SharedModule,
    PublicationRoutingModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class PublicationModule { }
