import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { Publication } from '../../../../core/models/publication';
import { PublicationService } from '../../../../core/services/publication.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CurationStatusListApiResponse } from '../../../../core/models/rest/api-responses/curationStatusListApiResponse';
import { CurationStatus } from '../../../../core/models/curationStatus';
import { Curator } from '../../../../core/models/curator';
import { CuratorListApiResponse } from '../../../../core/models/rest/api-responses/curatorListApiResponse';
import { EfoTrait } from '../../../../core/models/efoTrait';
import { ReportedTrait } from '../../../../core/models/reportedTrait';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-publications-list',
  templateUrl: './publications-list.component.html',
  styleUrls: ['./publications-list.component.css']
})
export class PublicationsListComponent implements OnInit, AfterViewInit {
  isLoadingResults = true;
  pmid: string;
  filterForm = new FormGroup({
    pmid: new FormControl(''),
    title: new FormControl(''),
    curator: new FormControl(''),
    submitter: new FormControl(''),
    curationStatus: new FormControl('')
  });
  showFilter = true;
  menuShow = false;
  visualization = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Publication>;
  displayedColumns: string[] = ['pmid', 'firstAuthor', 'title', 'submitter', 'curator', 'curationStatus', 'publicationDate'];
  curationStatus: CurationStatus[];
  curators: Curator[];
  resultsLength = 0;

  selectedCurationStatus: CurationStatus;

  constructor(private publicationService: PublicationService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.publicationService.getCurationStatuses()
      .subscribe((status: CurationStatusListApiResponse) => this.curationStatus = status._embedded.curationStatusDToes);
    this.publicationService.getCurators()
      .subscribe((curators: CuratorListApiResponse) => {
        curators._embedded.curatorDToes
          .forEach(curator => curator.fullName = (curator.firstName ? curator.firstName : '') + (curator.lastName ? ' ' + curator.lastName : ''));
        this.curators = curators._embedded.curatorDToes;
      });
  }

  ngAfterViewInit() {
    // add this.sort.sortChange to merge() params and delete datasource.sort = sort in subscribe() to enable server-side sorting
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.publicationService
            .getPublications(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active, this.sort.direction,
              this.filterForm.value.pmid, this.filterForm.value.title, this.filterForm.value.curator, this.filterForm.value.curationStatus,
              this.filterForm.value.submitter);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.page.totalElements;
          if (data?._embedded?.publications) {
            data._embedded.publications.forEach(p => {
              if (p.curator) {
                p.curator.fullName = (p.curator.firstName ? p.curator.firstName : '')
                  + (p.curator.lastName ? ' ' + p.curator.lastName : '');
              }
              else {
                p.curator = {curatorId: '', firstName: '', lastName: '', fullName: '', email: ''};
              }
              if (!p.curationStatus) {
                p.curationStatus = {curationStatusId: '', status: ''};
              }
            });
          }
          return data?._embedded?.publications;
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
    this.filterForm.reset();
  }

  search() {
    this.isLoadingResults = true;
    this.publicationService.getPublications(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active, this.sort.direction,
      this.filterForm.value.pmid, this.filterForm.value.title, this.filterForm.value.curator, this.filterForm.value.curationStatus,
      this.filterForm.value.submitter).subscribe(value => {
        if (value?._embedded?.publications) {
          value._embedded.publications.forEach(p => {
            if (p.curator) {
              p.curator.fullName = (p.curator.firstName ? p.curator.firstName : '')
                + (p.curator.lastName ? ' ' + p.curator.lastName : '');
            }
            else {
              p.curator = {curatorId: '', firstName: '', lastName: '', fullName: '', email: ''};
            }
            if (!p.curationStatus) {
              p.curationStatus = {curationStatusId: '', status: ''};
            }
          });
        }
        this.dataSource = new MatTableDataSource<Publication>(value?._embedded?.publications);
        this.isLoadingResults = false;
        this.resultsLength = value?.page.totalElements;
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

  resetPaging() {
    this.paginator.pageIndex = 0;
  }

  openSaveCurationDetailsDialog(pmid: string, curator: Curator, curationStatus: CurationStatus, originalValue: any, select: MatSelect) {
    select.value = originalValue;
    let message = '';
    if (curator) {
      if (originalValue?.curatorId === curator?.curatorId) { return; }
      message = 'Set <b>curator</b> for PMID ' + pmid + ': <b>' + curator.fullName + '</b>';
    }
    if (curationStatus) {
      if (originalValue?.curationStatusId === curationStatus?.curationStatusId) { return; }
      message = 'Set <b>curator</b> for PMID ' + pmid + ': <b>' + curationStatus.status + '</b>';
    }

    const dialogData = new ConfirmationDialogModel('Confirm save', message);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '800px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.isLoadingResults = true;
        this.publicationService.patchPublication(pmid, {curator, curationStatus}).subscribe(() => {
          this.isLoadingResults = false;
          this.snackBar.open('Save successful.', '', {duration: 2500});
          this.search();
        }, (error) => {
          this.isLoadingResults = false;
          if (error.error.indexOf('linked') > 0) {
            this.snackBar.open(error.error, '', {duration: 2500});
          }
          else {
            this.snackBar.open('Error occurred on save.', '', {duration: 2500});
          }
        });
      }
    });
  }

  compareCurationStatus(o1: CurationStatus, o2: CurationStatus) {
    return o1.curationStatusId === o2.curationStatusId;
  }

  compareCurator(o1: Curator, o2: Curator) {
    return o1.curatorId === o2.curatorId;
  }

}
