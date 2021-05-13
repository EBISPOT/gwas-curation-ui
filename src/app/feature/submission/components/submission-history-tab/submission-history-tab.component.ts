import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { VersioningComponent } from '../versioning/versioning.component';
import { MatDialog } from '@angular/material/dialog';
import { SubmissionService } from '../../../../core/services/submission.service';
import { ActivatedRoute } from '@angular/router';
import { SubmissionHistory } from '../../../../core/models/submissionHistory';

@Component({
  selector: 'app-submission-history-tab',
  templateUrl: './submission-history-tab.component.html',
  styleUrls: ['./submission-history-tab.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px'})),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class SubmissionHistoryTabComponent implements OnInit{

  columnsToDisplay = ['fileName', 'uploadDate', 'download', 'diff'];
  expandedElement: SubmissionHistory | null;
  dataSource: SubmissionHistory[];
  historySummaryReports: string[];

  constructor(public dialog: MatDialog, private submissionService: SubmissionService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.submissionService
      .getSubmissionHistory(this.route.snapshot.paramMap.get('id'))
      .subscribe(h => {
        this.dataSource = h;
        this.historySummaryReports = this.submissionService.generateSubmissionHistorySummaryReports(h);
      });
  }

  openDialog() {
    this.dialog.open(VersioningComponent, {width: '100%', height: '75%'});
  }

}
