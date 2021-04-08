import { NgModule } from '@angular/core';

import { SubmissionRoutingModule } from './submission-routing.module';
import { SubmissionListComponent } from './pages/submission-list/submission-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SubmissionDetailsComponent } from './pages/submission-details/submission-details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SubmissionDetailsTabComponent } from './components/submission-details-tab/submission-details-tab.component';
import { MatCardModule } from '@angular/material/card';
import { SubmissionEditTabComponent } from './components/submission-edit-tab/submission-edit-tab.component';
import { SubmissionHistoryTabComponent } from './components/submission-history-tab/submission-history-tab.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  declarations: [
    SubmissionListComponent, SubmissionDetailsComponent, SubmissionDetailsTabComponent, SubmissionEditTabComponent,
    SubmissionHistoryTabComponent
  ],
  imports: [
    SharedModule,
    SubmissionRoutingModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatTooltipModule,
    MatToolbarModule
  ]
})
export class SubmissionModule {
}
