import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, merge, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StudyService } from '../../../../core/services/study.service';
import { StudySearchApiResponse } from '../../../../core/models/rest/api-responses/studySearchApiResponse';
import { StudySolr } from '../../../../core/models/studySolr';
import { ReportedTrait } from '../../../../core/models/reportedTrait';
import { EfoTrait } from '../../../../core/models/efoTrait';
import { ReportedTraitService } from '../../../../core/services/reported-trait.service';
import { EfoTraitService } from '../../../../core/services/efo-trait.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-study-search',
  templateUrl: './study-search.component.html',
  styleUrls: ['./study-search.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StudySearchComponent implements OnInit, AfterViewInit{
  displayedColumns: string[] = [ 'accessionId', 'pmid', 'publicationDate', 'firstAuthor', 'title', 'efoTrait', 'reportedTrait', 'note'];

  resultsLength = 0;
  isLoadingResults = true;
  searchBoxValue = '';

  dataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  reportedTraitsDropdownItems: ReportedTrait[] = [];
  efoTraitsDropdownItems: EfoTrait[] = [];
  reportedTrait: string;
  efoTrait: string;
  @ViewChild('reportedTraitInput') reportedTraitInput: ElementRef;
  @ViewChild('efoTraitInput') efoTraitInput: ElementRef;

  gxe = 'any';
  pooled = 'any';
  sumstats = 'any';

  expandedElement: StudySolr | null;

  constructor(private studyService: StudyService, private reportedTraitService: ReportedTraitService, private efoTraitService: EfoTraitService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.studyService
            .search(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active,
              this.sort.direction, this.efoTrait, this.efoTrait, this.searchBoxValue,
              this.sumstats, this.pooled, this.gxe);
        }),
        map((data: StudySearchApiResponse) => {
          this.isLoadingResults = false;
          this.resultsLength = data.page.totalElements;
          return data?._embedded?.studySolrDToes;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        })
      )
      .subscribe(value => {
        this.dataSource = new MatTableDataSource<StudySolr>(value);
      });

    fromEvent(this.reportedTraitInput.nativeElement, 'input').pipe()
      .pipe(map((event: Event) => (event.target as HTMLInputElement).value))
      .pipe(debounceTime(1000))
      .pipe(distinctUntilChanged())
      .subscribe(data => {
        this.reportedTraitService.getTraits(1000, 0, 'trait', 'asc', data).subscribe(value => {
          if (value?._embedded?.diseaseTraits) {
            this.reportedTraitsDropdownItems = value._embedded.diseaseTraits;
          }
          else {
            this.reportedTraitsDropdownItems = [];
          }
        });
      });

    fromEvent(this.efoTraitInput.nativeElement, 'input').pipe()
      .pipe(map((event: Event) => (event.target as HTMLInputElement).value))
      .pipe(debounceTime(1000))
      .pipe(distinctUntilChanged())
      .subscribe(data => {
        this.efoTraitService.getTraits(50, 0, 'trait', 'asc', data).subscribe(value => {
          if (value?._embedded?.efoTraits) {
            this.efoTraitsDropdownItems = value._embedded.efoTraits;
          }
          else {
            this.efoTraitsDropdownItems = [];
          }
        });
      });
  }

  search() {
    this.isLoadingResults = true;
    this.studyService.search(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active,
      this.sort.direction, this.efoTrait, this.reportedTrait, this.searchBoxValue,
      this.sumstats, this.pooled, this.gxe).subscribe((data: StudySearchApiResponse) => {
        this.resultsLength = data.page.totalElements;
        this.dataSource = new MatTableDataSource<StudySolr>(data?._embedded?.studySolrDToes);
        this.isLoadingResults = false;
      }, error => {
        this.isLoadingResults = false;
        this.snackBar.open('Error occurred, make sure search parameters are valid', '', {duration: 3000});
    });
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  resetFilters() {
    this.efoTrait = null;
    this.reportedTrait = null;
    this.gxe = 'any';
    this.pooled = 'any';
    this.sumstats = 'any';
    this.searchBoxValue = null;
  }
}
