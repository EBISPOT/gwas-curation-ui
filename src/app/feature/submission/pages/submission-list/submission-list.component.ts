import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../core/services/http.service';
import { Submission } from '../../../../core/models/submission';
import { merge, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SubmissionService } from '../../../../core/services/submission.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.css']
})
export class SubmissionListComponent implements AfterViewInit {
  displayedColumns: string[] = ['pmid', 'gcp', 'submissionId', 'firstAuthor', 'submissionStatus', 'metadataStatus',
    'summaryStatisticsStatus', 'submitter', 'lastUpdated', 'started', 'being_edited'];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Submission>;

  constructor(private http: HttpService, private submissionService: SubmissionService) {
  }

  ngAfterViewInit() {
    // add this.sort.sortChange to merge() params and delete datasource.sort = sort in subscribe() to enable server-side sorting
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.submissionService
            .getSubmissions(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active, this.sort.direction);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.page.totalElements;
          return data._embedded.submissions;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        })
      )
      .subscribe(value => {
        this.dataSource = new MatTableDataSource<Submission>(value);
        this.dataSource.sort = this.sort;
      });
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

}