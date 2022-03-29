import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../core/services/http.service';
import { Submission } from '../../../../core/models/submission';
import { merge, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SubmissionService } from '../../../../core/services/submission.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.css']
})
export class SubmissionListComponent implements AfterViewInit {
  displayedColumns: string[] = ['pmid', 'gcp', 'firstAuthor', 'submissionStatus', 'metadataStatus',
    'summaryStatisticsStatus', 'submitter', 'lastUpdated', 'started', 'being_edited'];

  resultsLength = 0;
  isLoadingResults = true;
  searchBoxValue = '';

  showFilter = true;
  menuShow = false;
  visualization = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Submission>;
  filtersString = '';

  filterForm = new FormGroup({
    metaStatus: new FormGroup({
      VALID: new FormControl(false),
      INVALID: new FormControl(false),
      VALIDATING: new FormControl(false),
      NA: new FormControl(false)
    }),
    ssStatus: new FormGroup({
      VALID: new FormControl(false),
      INVALID: new FormControl(false),
      VALIDATING: new FormControl(false),
      NA: new FormControl(false)
    }),
    submissionStatus: new FormGroup({
      SUBMITTED: new FormControl(false),
      STARTED: new FormControl(false),
      VALID: new FormControl(false),
      INVALID: new FormControl(false),
      VALIDATING: new FormControl(false),
      CURATION_COMPLETE: new FormControl(false)
    }),
    lockStatus: new FormGroup({
      LOCKED_FOR_EDITING: new FormControl(false),
    })
  });

  constructor(private http: HttpService, private submissionService: SubmissionService) {
  }

  ngAfterViewInit() {
    // add this.sort.sortChange to merge() params and delete datasource.sort = sort in subscribe() to enable server-side sorting
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.submissionService
            .getSubmissions(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active,
              this.sort.direction, null, this.filtersString);
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
      });
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  submitFilter() {

    this.filtersString = '';

    Object.keys(this.filterForm.controls).forEach(key1 => {
      const control = this.filterForm.controls[key1] as FormControl | FormGroup;
      if (control instanceof FormGroup) {
        let filterString = '';
        Object.keys(control.controls).forEach(key2 => {
          if (control.controls[key2].value) {
            filterString += key2 + '|';
          }
        });
        if (filterString) {
          // removing last separator
          filterString = filterString.substring(0, filterString.length - 1);
          if (this.filtersString) {
            this.filtersString += '&';
          }
          this.filtersString += key1 + '=' + filterString;
        }
      }
    });

    this.resetPaging();
    this.isLoadingResults = true;
    this.submissionService
      .filterSubmissions(this.filtersString, this.paginator.pageSize, 0, this.sort.active, this.sort.direction)
      .subscribe(value => {
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource<Submission>(value?._embedded?.submissions ? value._embedded.submissions : null);
        this.resultsLength = value.page.totalElements;
      });
  }

  search() {
    this.isLoadingResults = true;
    if (this.searchBoxValue === '' || this.searchBoxValue.match(/^\d+$/) || this.searchBoxValue.startsWith('GCP')) {
      this.submissionService
        .getSubmissions(this.paginator.pageSize, 0, this.sort.active, this.sort.direction, this.searchBoxValue, null)
        .subscribe(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.page.totalElements;
          this.dataSource = new MatTableDataSource<Submission>(data._embedded.submissions);
        }, () => {
          this.isLoadingResults = false;
          this.resultsLength = 0;
          this.dataSource = new MatTableDataSource<Submission>([]);
        });
    }
    else {
      this.submissionService
        .getSubmission(this.searchBoxValue)
        .subscribe(data => {
          this.isLoadingResults = false;
          this.resultsLength = 1;
          this.dataSource = new MatTableDataSource<Submission>([data]);
        }, () => {
          this.isLoadingResults = false;
          this.resultsLength = 0;
          this.dataSource = new MatTableDataSource<Submission>([]);
        });
    }
  }

  toggleDisplay(compType: string) {
    if (compType === 'filter') {
      this.showFilter = (this.showFilter !== true);
    } else if (compType === 'menuShow') {
      this.menuShow = (this.menuShow !== true);
    } else if (compType === 'visualization') {
      this.visualization = (this.visualization !== true);
    }
  }
}
