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
  traitUploader: FileUploader;
  analysisUploader: FileUploader;
  isChecked = false;
  hasDropZoneOver = false;
  analysisHasDropZoneOver = false;
  uploadResponse: ReportedTraitUploadApiResponse[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('analysisFileInput') analysisFileInput: ElementRef;
  dataSource: MatTableDataSource<ReportedTrait>;
  showTraitUpload = false;
  showSimilarityAnalysis = false;
  analysisId = '';

  constructor(private reportedTraitService: ReportedTraitService, private tokenService: TokenStorageService,
              private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.traitUploader = new FileUploader(
      {
        url: environment.CURATION_API_URL + '/reported-traits/fileupload/uploads', itemAlias: 'multipartFile',
        authToken: 'Bearer ' + tokenService.getToken()
      });
    this.analysisUploader = new FileUploader(
      {
        url: environment.CURATION_API_URL + '/reported-traits/fileupload/analysis', itemAlias: 'multipartFile',
        authToken: 'Bearer ' + tokenService.getToken()
      });
  }

  ngOnInit(): void {
    this.traitUploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.uploadResponse = [];
      if (this.traitUploader.queue.length > 1) {
        this.traitUploader.cancelAll();
        this.traitUploader.removeFromQueue(this.traitUploader.queue[0]);
      }
    };
    this.traitUploader.onSuccessItem = (item, response) => {
      this.snackBar.open('Traits file was uploaded successfully.', '', {duration: 2500});
      this.uploadResponse = JSON.parse(response);
      this.traitUploader.clearQueue();
      this.fileInput.nativeElement.value = '';
      this.reloadTraits();
    };
    this.traitUploader.onErrorItem = () => {
      this.snackBar.open('An unexpected error occurred while uploading traits.', '', {duration: 2500});
    };

    this.analysisUploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.analysisId = '';
      if (this.analysisUploader.queue.length > 1) {
        this.analysisUploader.cancelAll();
        this.analysisUploader.removeFromQueue(this.analysisUploader.queue[0]);
      }
    };
    this.analysisUploader.onSuccessItem = (item, response) => {
      this.snackBar.open('Analysis file was uploaded successfully.', '', {duration: 2500});
      this.analysisId = JSON.parse(response).uniqueId;
      this.analysisUploader.clearQueue();
      this.analysisFileInput.nativeElement.value = '';
    };
    this.analysisUploader.onErrorItem = () => {
      this.snackBar.open('An unexpected error occurred while uploading analysis.', '', {duration: 2500});
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
    }, (e) => {
      this.isLoadingEdit = false;
      this.editError = 'An unexpected error occurred.';
      if (e.includes('duplicate')) {
        this.editError = 'Error occurred, make sure trait doesnt already exist.';
      }
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

  traitUploadFileOver(e) {
    this.hasDropZoneOver = e;
  }

  analysisUploadFileOver(e) {
    this.analysisHasDropZoneOver = e;
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

  downloadSimilarityAnalysisTemplate() {
    this.reportedTraitService.downloadSimilarityAnalysisTemplate().subscribe((response: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', 'similarity-analysis-template.tsv');
      document.body.appendChild(link);
      link.click();
    });
  }

  downloadSimilarityAnalysisReport() {
    this.reportedTraitService.downloadSimilarityAnalysisReport(this.analysisId).subscribe((response: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', 'similarity-analysis-report.tsv');
      document.body.appendChild(link);
      link.click();
    }, () => {
      this.snackBar.open('An unexpected error occurred. Uploaded file may be invalid.', '', {duration: 2500});
    });
  }

  search() {
    this.isLoadingResults = true;
    if (this.searchBoxValue === '') {
      this.reportedTraitService
        .getTraits(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active, this.sort.direction, null)
        .subscribe(value => {
          this.isLoadingResults = false;
          this.dataSource = new MatTableDataSource<ReportedTrait>(value._embedded.diseaseTraits);
          this.resultsLength = value.page.totalElements;
        });
    }
    else {
      this.reportedTraitService
        .getTraits(this.paginator.pageSize, 0, this.sort.active, this.sort.direction, this.searchBoxValue)
        .subscribe(value => {
          this.isLoadingResults = false;
          this.dataSource = new MatTableDataSource<ReportedTrait>(value._embedded.diseaseTraits);
          this.resultsLength = value.page.totalElements;
        });
    }
  }
}
