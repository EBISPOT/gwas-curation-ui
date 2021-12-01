import { NgModule } from '@angular/core';

import { SubmissionRoutingModule } from './submission-routing.module';
import { SubmissionListComponent } from './pages/submission-list/submission-list.component';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SubmissionDetailsComponent } from './pages/submission-details/submission-details.component';
import { SubmissionDetailsTabComponent } from './components/submission-details-tab/submission-details-tab.component';
import { SubmissionEditTabComponent } from './components/submission-edit-tab/submission-edit-tab.component';
import { SubmissionHistoryTabComponent } from './components/submission-history-tab/submission-history-tab.component';
import { SharedModule } from '../../shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { VersioningComponent } from './components/versioning/versioning.component';
import { StudyTabComponent } from './components/study-tab/study-tab.component';

@NgModule({
  declarations: [
    SubmissionListComponent, SubmissionDetailsComponent, SubmissionDetailsTabComponent, SubmissionEditTabComponent,
    SubmissionHistoryTabComponent, VersioningComponent, StudyTabComponent
  ],
    imports: [
        SharedModule,
        SubmissionRoutingModule,
        MatSortModule,
        MatPaginatorModule,
        FileUploadModule
    ]
})
export class SubmissionModule {
}
