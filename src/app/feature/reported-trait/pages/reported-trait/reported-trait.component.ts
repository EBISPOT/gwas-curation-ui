import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ReportedTraitService } from '../../../../core/services/reported-trait.service';
import { ReportedTrait } from '../../../../core/models/reportedTrait';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reported-trait',
  templateUrl: './reported-trait.component.html',
  styleUrls: ['./reported-trait.component.css']
})
export class ReportedTraitComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['trait', 'delete'];
  resultsLength = 0;
  isLoadingResults = true;
  isLoadingCreate = false;
  createTraitName: string;
  searchBoxValue = '';
  createError = '';
  dialogRef: MatDialogRef<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<ReportedTrait>;

  constructor(private reportedTraitService: ReportedTraitService,
              private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // add this.sort.sortChange to merge() params and delete datasource.sort = sort in subscribe() to enable server-side sorting
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.reportedTraitService
            .getTraits(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active, this.sort.direction, null);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.page.totalElements;
          return data._embedded.diseaseTraits;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        })
      )
      .subscribe(value => {
        this.dataSource = new MatTableDataSource<ReportedTrait>(value);
      });
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  openDialog(templateRef) {
    this.createTraitName = '';
    this.dialogRef = this.dialog.open(templateRef, {
      width: '300px'
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onCreateTrait() {
    this.isLoadingCreate = true;
    this.createError = '';
    this.reportedTraitService.createTrait(this.createTraitName).subscribe(() => {
      this.isLoadingCreate = false;
      this.dialogRef.close();
      this.snackBar.open('Trait created.', '', {duration: 2500});
      this.reloadTraits();
    }, () => {
      this.isLoadingCreate = false;
      this.createError = 'An unexpected error occurred.';
    });
  }

  reloadTraits() {
    this.isLoadingResults = true;
    this.reportedTraitService
      .getTraits(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active, this.sort.direction, null)
      .subscribe(value => {
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource<ReportedTrait>(value._embedded.diseaseTraits);
        this.resultsLength = value.page.totalElements;
      });
  }

  openConfirmationDialog(trait: ReportedTrait) {
    const message = 'Disease trait: ' + trait.trait;

    const dialogData = new ConfirmationDialogModel('Confirm deletion', message);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.reportedTraitService.deleteTrait(trait.diseaseTraitId).subscribe(() => {
          this.snackBar.open('Trait deleted.', '', {duration: 2500});
          this.reloadTraits();
        }, () => {
          this.snackBar.open('Error occurred on delete.', '', {duration: 2500});
        });
      }
    });
  }
}
