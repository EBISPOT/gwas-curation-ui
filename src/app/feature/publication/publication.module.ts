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
import { SubmissionModule } from '../submission/submission.module';
import { LiteratureTabComponent } from './components/literature-tab/literature-tab.component';
import { FileUploadModule } from 'ng2-file-upload';
import { EventTrackingComponent } from './components/event-tracking/event-tracking.component';


@NgModule({
  declarations: [PublicationsListComponent, ImportPublicationComponent, CheckSubmissionDialogComponent, PublicationDetailsComponent, LiteratureTabComponent, EventTrackingComponent],
  imports: [
    SharedModule,
    PublicationRoutingModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSortModule,
    MatPaginatorModule,
    MatChipsModule,
    SubmissionModule,
    FileUploadModule
  ]
})
export class PublicationModule { }
