import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SubmissionMatchingReport } from '../../../../core/models/submissionMatchingReport';
import { MatPaginator } from '@angular/material/paginator';
import { PublicationService } from '../../../../core/services/publication.service';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-check-submission-dialog',
  templateUrl: './check-submission-dialog.component.html',
  styleUrls: ['./check-submission-dialog.component.css']
})
export class CheckSubmissionDialogComponent implements OnInit {

  pmid = '';
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
              @Inject(MAT_DIALOG_DATA) public data: {pubmedId: string}) {
    this.pmid = data.pubmedId;
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
    let filter = 'GCPOnly';
    if ($event.checked) {
      filter = 'include';
    }
    this.dataSource.filter = filter;
    this.dataSource.paginator.pageIndex = 0;
  }
}
