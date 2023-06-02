import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { Publication } from '../../../../core/models/publication';
import { PublicationService } from '../../../../core/services/publication.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-publications-list',
  templateUrl: './publications-list.component.html',
  styleUrls: ['./publications-list.component.css']
})
export class PublicationsListComponent implements OnInit, AfterViewInit {
  isLoadingResults = true;
  pmid: string;
  options: string[] = ['Elliot Sollis', 'Laura Harris', 'Santhi Ramachandran', 'Elizabeth Lewis'];
  filteredOptions: Observable<string[]>;
  filterForm = new FormGroup({
    pmid: new FormControl(''),
    title: new FormControl(''),
    curator: new FormControl('')
  });
  showFilter = true;
  menuShow = false;
  visualization = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Publication>;
  displayedColumns: string[] = ['pmid', 'firstAuthor', 'title', 'submitter', 'curator', 'curationStatus', 'publicationDate'];
  curationStatuses: string[] = ['Level 1 ancestry done','Level 2 ancestry done','Level 1 curation done','Level 2 curation done','Publish study','Awaiting Curation','Outstanding Query','CNV Paper','Curation Abandoned','Conversion Problem','Unpublished from catalog','Pending author query','Awaiting EFO assignment','Requires re-curation','Preliminary review done','Level 3 curation done','Awaiting mapping','Awaiting literature','Permanently unpublished from catalog','Scientific pilot','Requires Review'];
  resultsLength = 0;

  constructor(private publicationService: PublicationService) { }

  ngOnInit(): void {
    this.filteredOptions = this.filterForm.controls.curator.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCurator(value || '')),
    );
  }

  ngAfterViewInit() {
    // add this.sort.sortChange to merge() params and delete datasource.sort = sort in subscribe() to enable server-side sorting
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.publicationService
            .getPublications(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active, this.sort.direction, null, null, null);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.page.totalElements;
          return data?._embedded?.solrPublicationDToes;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        })
      )
      .subscribe(value => {
        this.dataSource = new MatTableDataSource<Publication>(value);
      });
  }

  resetFilters() {

  }

  search() {
    this.isLoadingResults = true;
    this.publicationService.getPublications(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active, this.sort.direction,
      this.filterForm.value.pmid, this.filterForm.value.title, this.filterForm.value.curator).subscribe(value => {
      this.dataSource = new MatTableDataSource<Publication>(value?._embedded?.solrPublicationDToes);
      this.isLoadingResults = false;
    });
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

  submitFilter() {

  }

  private _filterCurator(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  resetPaging() {
    this.paginator.pageIndex = 0;
  }
}
