import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EfoTraitService } from '../../../../core/services/efo-trait.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { EfoTrait } from '../../../../core/models/efoTrait';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../../environments/environment';
import { TraitUploadApiResponse } from '../../../../core/models/rest/api-responses/traitUploadApiResponse';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-efo-traits',
  templateUrl: './efo-traits.component.html',
  styleUrls: ['./efo-traits.component.css']
})
export class EfoTraitsComponent implements OnInit, AfterViewInit {

  creationForm = new FormGroup({
    createTraitName: new FormControl('', [Validators.required]),
    createTraitUri: new FormControl('', [Validators.required, Validators.pattern('(https?://)?([\\da-zA-Z.-]+)\\.([a-zA-Z.]{2,6})[/\\w .-]*/?')]),
    createTraitShortForm: new FormControl('')
  });
  editForm = new FormGroup({
    id: new FormControl(''),
    trait: new FormControl('', [Validators.required]),
    uri: new FormControl('', [Validators.required, Validators.pattern('(https?://)?([\\da-zA-Z.-]+)\\.([a-zA-Z.]{2,6})[/\\w .-]*/?')]),
    shortForm: new FormControl('', [Validators.required])
  });
  dialogRef: MatDialogRef<any>;
  isLoadingCreate = false;
  createError = '';
  isLoadingResults = true;
  showTraitUpload = false;
  traitUploader: FileUploader;
  hasDropZoneOver = false;
  uploadResponse: TraitUploadApiResponse[] = [];
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<EfoTrait>;
  resultsLength = 0;
  searchBoxValue = '';
  isLoadingEdit = false;
  editError = '';
  displayedColumns: string[] = ['trait', 'uri', 'shortForm', 'delete'];
  editFormInitialValue: any;
  isEditFormDirty = false;
  menuShow = false;

  constructor(private tokenService: TokenStorageService, private dialog: MatDialog,
              private snackBar: MatSnackBar, private efoTraitService: EfoTraitService) {
    this.traitUploader = new FileUploader(
      {
        url: environment.CURATION_API_URL + '/efo-traits/bulk-upload', itemAlias: 'multipartFile',
        authToken: 'Bearer ' + tokenService.getToken()
      });
  }

  ngOnInit(): void {

    this.editFormInitialValue = this.editForm.value;
    this.editForm.valueChanges.subscribe(() => {
      this.isEditFormDirty = Object.keys(this.editFormInitialValue)
        .some(key => this.editForm.value[key] !== this.editFormInitialValue[key]);
    });

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
  }

  ngAfterViewInit() {
    // add this.sort.sortChange to merge() params and delete datasource.sort = sort in subscribe() to enable server-side sorting
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.efoTraitService
            .getTraits(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active, this.sort.direction, this.searchBoxValue);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.page.totalElements;
          return data._embedded.efoTraits;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        })
      )
      .subscribe(value => {
        this.dataSource = new MatTableDataSource<EfoTrait>(value);
      });
  }

  openCreateDialog(templateRef) {
    this.creationForm.reset();
    this.dialogRef = this.dialog.open(templateRef, {
      width: '500px'
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onCreateTrait() {
    this.isLoadingCreate = true;
    this.createError = '';
    const trait = this.creationForm.controls.createTraitName.value;
    const uri = this.creationForm.controls.createTraitUri.value;
    let shortForm = this.creationForm.controls.createTraitShortForm.value;
    if (!shortForm) {
      shortForm = uri.substring(uri.lastIndexOf('/') + 1);
    }
    const efoTrait: EfoTrait = {trait, uri, shortForm, created: null, edited: null, efoTraitId: null};
    this.efoTraitService.createTrait(efoTrait).subscribe(() => {
      this.isLoadingCreate = false;
      this.dialogRef.close();
      this.snackBar.open('Trait created.', '', {duration: 2500});
      this.reloadTraits();
    }, () => {
      this.isLoadingCreate = false;
      this.createError = 'An unexpected error occurred.';
    });
  }

  toggleDisplay(compType: string) {
    if (compType === 'menuShow') {
      this.menuShow = (this.menuShow !== true);
    }
  }

  reloadTraits() {
    this.isLoadingResults = true;
    this.efoTraitService
      .getTraits(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active, this.sort.direction, null)
      .subscribe(value => {
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource<EfoTrait>(value._embedded.efoTraits);
        this.resultsLength = value.page.totalElements;
      });
  }

  traitUploadFileOver(e) {
    this.hasDropZoneOver = e;
  }

  downloadBulkEfoTraitUploadTemplate() {
    this.efoTraitService.downloadBulkEfoTraitUploadTemplate().subscribe((response: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', 'efo-traits-bulk-upload.tsv');
      document.body.appendChild(link);
      link.click();
    });
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  search() {
    this.resetPaging();
    this.isLoadingResults = true;
    this.efoTraitService
      .getTraits(this.paginator.pageSize, 0, this.sort.active, this.sort.direction, this.searchBoxValue)
      .subscribe(value => {
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource<EfoTrait>(value?._embedded?.efoTraits ? value._embedded.efoTraits : null);
        this.resultsLength = value.page.totalElements;
      });
  }

  openEditDialog(editDialog, trait: EfoTrait) {
    this.editForm.controls.id.setValue(trait.efoTraitId);
    this.editForm.controls.trait.setValue(trait.trait);
    this.editForm.controls.uri.setValue(trait.uri);
    this.editForm.controls.shortForm.setValue(trait.shortForm);
    this.editFormInitialValue = this.editForm.value;
    // only to trigger form valueChanges
    this.editForm.controls.trait.setValue(trait.trait);
    this.dialogRef = this.dialog.open(editDialog, {
      width: '500px'
    });
  }

  openDeleteConfirmationDialog(efoTrait: EfoTrait) {
    const message = 'EFO trait: ' + efoTrait.trait;

    const dialogData = new ConfirmationDialogModel('Confirm deletion', message);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.isLoadingResults = true;
        this.efoTraitService.deleteTrait(efoTrait.efoTraitId).subscribe(() => {
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
          this.isLoadingResults = false;
          this.snackBar.open('Error occurred on delete.', '', {duration: 2500});
        });
      }
    });
  }

  onSaveEditedTrait() {
    this.isLoadingEdit = true;
    const trait = this.editForm.controls.trait.value;
    const uri = this.editForm.controls.uri.value;
    const shortForm = this.editForm.controls.shortForm.value;
    const efoTrait: EfoTrait = {uri, trait, shortForm, efoTraitId: null, edited: null, created: null};
    const id = this.editForm.controls.id.value;
    this.efoTraitService.editTrait(id, efoTrait).subscribe(() => {
      this.isLoadingEdit = false;
      this.dialogRef.close();
      this.snackBar.open('Trait saved.', '', {duration: 2500});
      this.reloadTraits();
    },
    (e) => {
      this.isLoadingEdit = false;
      this.editError = 'An unexpected error occurred.';
      if (e.includes('already')) {
        this.editError = 'Error occurred, make sure trait doesnt already exist.';
      }
    });
  }
}
