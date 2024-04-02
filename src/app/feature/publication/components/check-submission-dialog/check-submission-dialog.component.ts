import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SubmissionMatchingReport } from '../../../../core/models/submissionMatchingReport';
import { MatPaginator } from '@angular/material/paginator';
import { PublicationService } from '../../../../core/services/publication.service';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-check-submission-dialog',
  templateUrl: './check-submission-dialog.component.html',
  styleUrls: ['./check-submission-dialog.component.css']
})
export class CheckSubmissionDialogComponent implements OnInit {

  pmid = '';
  title = '';
  author = '';
  displayedColumns = ['submissionId', 'author', 'title', 'doi', 'cosineScore', 'linkSubmission'];
  dataSource = new MatTableDataSource<SubmissionMatchingReport>();
  matchingReportList: SubmissionMatchingReport[];
  loadingInProgress = false;
  resultsLength = 0;
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(private publicationService: PublicationService,
              @Inject(MAT_DIALOG_DATA) public data: {pubmedId: string, title: string, author: string},
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<SubmissionMatchingReport>,
              private confirmationDialog: MatDialog) {
    this.pmid = data.pubmedId;
    this.title = data.title;
    this.author = data.author;
  }

  ngOnInit(): void {
    this.loadingInProgress = true;
    this.matchingReportList = [];
    this.publicationService.getSubmissionMatchingReport(this.pmid).subscribe(value => {
      this.loadingInProgress = false;
      this.matchingReportList = value?._embedded?.matchPublicationReportDToes;
      this.dataSource = new MatTableDataSource<SubmissionMatchingReport>(this.matchingReportList);
      this.resultsLength = this.matchingReportList.length;
      this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
        if (typeof data[sortHeaderId] === 'string') {
          return data[sortHeaderId].toLocaleLowerCase();
        }
        return data[sortHeaderId];
      };
      this.dataSource.filterPredicate = (data, filter) => {
        if (filter === 'include') {
          return true;
        }
        return data.pubMedID == null;
      };
      this.dataSource.filter = 'GCPOnly';
    });
  }

  filter($event: MatCheckboxChange) {
    let filter: string;
    if ($event.checked) {
      this.displayedColumns.unshift('pubMedID');
      filter = 'include';
    }
    else {
      this.displayedColumns.shift();
      filter = 'GCPOnly';
    }
    this.dataSource.filter = filter;
    this.dataSource.paginator.pageIndex = 0;
  }

  linkSubmission(submissionId: string, submissionAuthor: string) {
    const message = 'You are about to link <b>PMID:' + this.pmid + '</b> by <b>' + (this.author ? this.author : 'NA') +
      '</b> to Submission <b>' + submissionId + '</b> by <b>' + submissionAuthor + '</b>, continue?';
    const dialogData = new ConfirmationDialogModel('Confirm?', message);

    const dialogRef = this.confirmationDialog.open(ConfirmationDialogComponent, {
      maxWidth: '900px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult: any) => {
      if (dialogResult) {
        this.loadingInProgress = true;
        this.publicationService
          .linkSubmission(this.pmid, submissionId)
          .subscribe(() => {
            this.loadingInProgress = false;
            this.snackBar.open('Success! Submission linked', '', {duration: 2500});
            this.dialogRef.close();
          }, (error) => {
            this.loadingInProgress = false;
            this.snackBar.open(error.error , '', {duration: 2500});
          });
      }
    });
  }
}
