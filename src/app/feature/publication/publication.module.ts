import { NgModule } from '@angular/core';
import { PublicationsListComponent } from './pages/publications-list/publications-list.component';
import { SharedModule } from '../../shared/shared.module';
import { PublicationRoutingModule } from './publication-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ImportPublicationComponent } from './pages/import-publication/import-publication.component';
import { MatChipsModule } from '@angular/material/chips';
import { CheckSubmissionDialogComponent } from './components/check-submission-dialog/check-submission-dialog.component';
import { PublicationDetailsComponent } from './pages/publication-details/publication-details.component';


@NgModule({
  declarations: [PublicationsListComponent, ImportPublicationComponent, CheckSubmissionDialogComponent, PublicationDetailsComponent],
  imports: [
    SharedModule,
    PublicationRoutingModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSortModule,
    MatPaginatorModule,
    MatChipsModule
  ]
})
export class PublicationModule { }
