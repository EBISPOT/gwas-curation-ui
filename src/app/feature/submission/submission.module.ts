import { NgModule } from '@angular/core';

import { SubmissionRoutingModule } from './submission-routing.module';
import { SubmissionListComponent } from './pages/submission-list/submission-list.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SubmissionDetailsComponent } from './pages/submission-details/submission-details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SubmissionDetailsTabComponent } from './components/submission-details-tab/submission-details-tab.component';
import { SubmissionEditTabComponent } from './components/submission-edit-tab/submission-edit-tab.component';
import { SubmissionHistoryTabComponent } from './components/submission-history-tab/submission-history-tab.component';
import { SharedModule } from '../../shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    SubmissionListComponent, SubmissionDetailsComponent, SubmissionDetailsTabComponent, SubmissionEditTabComponent,
    SubmissionHistoryTabComponent
  ],
    imports: [
        SharedModule,
        SubmissionRoutingModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        MatTabsModule,
        MatProgressBarModule,
        FileUploadModule
    ]
})
export class SubmissionModule {
}
