import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../../environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ReportedTraitUploadApiResponse } from '../../../../core/models/rest/api-responses/reportedTraitUploadApiResponse';

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
  createTraitName = '';
  isLoadingEdit = false;
  editTraitName = '';
  searchBoxValue = '';
  createError = '';
  editError = '';
  dialogRef: MatDialogRef<any>;
  uploader: FileUploader;
  isChecked = false;
  hasDropZoneOver = false;
  uploadResponse: ReportedTraitUploadApiResponse[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileInput') fileInput: ElementRef;
  dataSource: MatTableDataSource<ReportedTrait>;

  constructor(private reportedTraitService: ReportedTraitService, private tokenService: TokenStorageService,
              private dialog: MatDialog, private snackBar: MatSnackBar, private bottomSheet: MatBottomSheet) {
    this.uploader = new FileUploader(
      {
        url: environment.CURATION_API_URL + '/reported-traits/fileupload/uploads', itemAlias: 'multipartFile',
        authToken: 'Bearer ' + tokenService.getToken()
      });
  }

  ngOnInit(): void {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.uploadResponse = [];
      if (this.uploader.queue.length > 1) {
        this.uploader.cancelAll();
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
    };
    this.uploader.onSuccessItem = (item, response) => {
      this.snackBar.open('File was uploaded successfully.', '', {duration: 2500});
      this.uploadResponse = JSON.parse(response);
      this.uploader.clearQueue();
      this.fileInput.nativeElement.value = '';
      this.reloadTraits();
    };
    this.uploader.onErrorItem = () => {
      this.snackBar.open('An unexpected error occurred while uploading.', '', {duration: 2500});
    };
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

  openCreateDialog(templateRef) {
    this.createTraitName = '';
    this.dialogRef = this.dialog.open(templateRef, {
      width: '500px'
    });
  }

  openEditDialog(editDialog, trait: ReportedTrait) {
    this.editTraitName = trait.trait;
    this.dialogRef = this.dialog.open(editDialog, {
      width: '500px'
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

  onSaveEditedTrait(traitId) {
    this.isLoadingEdit = true;
    this.editError = '';
    this.reportedTraitService.editTrait(traitId, this.editTraitName).subscribe(() => {
      this.isLoadingEdit = false;
      this.dialogRef.close();
      this.snackBar.open('Trait saved.', '', {duration: 2500});
      this.reloadTraits();
    }, () => {
      this.isLoadingEdit = false;
      this.editError = 'An unexpected error occurred.';
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

  openDeleteConfirmationDialog(trait: ReportedTrait) {
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
          // so that if only 1 item is on last page, we go back to previous page after deleting that item
          if (this.paginator.pageIndex + 1 === this.paginator.getNumberOfPages()
              && this.dataSource.data.length % this.paginator.pageSize === 1) {
            this.paginator.previousPage();
          }
          else {
            this.reloadTraits();
          }
        }, () => {
          this.snackBar.open('Error occurred on delete.', '', {duration: 2500});
        });
      }
    });
  }

  fileOver(e) {

    this.hasDropZoneOver = e;
  }

  openUploadBottomSheet(bottomSheet) {
    this.bottomSheet.open(bottomSheet);
  }

  downloadBulkTraitUploadTemplate() {
    this.reportedTraitService.downloadBulkTraitUploadTemplate().subscribe((response: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', 'disease-traits-bulk-upload.tsv');
      document.body.appendChild(link);
      link.click();
    });
  }
}
