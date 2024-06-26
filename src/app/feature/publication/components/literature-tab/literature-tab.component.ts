import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../../environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Publication } from '../../../../core/models/publication';
import { PublicationService } from '../../../../core/services/publication.service';
import { Literature } from '../../../../core/models/literature';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-literature-tab',
  templateUrl: './literature-tab.component.html',
  styleUrls: ['./literature-tab.component.css']
})
export class LiteratureTabComponent implements OnInit {
  dataSource: MatTableDataSource<Literature>;
  uploader: FileUploader;
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input()
  publication: Publication;
  files = [];
  isLoadingLiterature = true;

  constructor(private tokenService: TokenStorageService, private snackBar: MatSnackBar, private publicationService: PublicationService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.uploader = new FileUploader({
      url: environment.CURATION_API_URL + '/publications/' + this.publication?.pmid + '/literature-files', itemAlias: 'multipartFile',
      authToken: 'Bearer ' + this.tokenService.getToken()
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onErrorItem = () => {
      this.isLoadingLiterature = false;
      this.snackBar.open('An unexpected error occurred while uploading literature.', '', {duration: 2500});
    };

    this.uploader.onCompleteAll = () => {
      this.isLoadingLiterature = false;
      this.snackBar.open('Files uploaded successfully.', '', {duration: 2500});
      this.getFiles();
      this.uploader.clearQueue();
    };

    this.getFiles();
  }

  downloadLiteratureFile(fileId: string, fileName: string) {
    this.publicationService.downloadLiteratureFile(this.publication.pmid, fileId).subscribe(response => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    });
  }

  getFiles() {
    this.isLoadingLiterature = true;
    this.publicationService.getLiteratureFiles(this.publication?.pmid).subscribe(resp => {
      this.files = resp?._embedded ? resp?._embedded['literature-files'] : [];
      this.dataSource = new MatTableDataSource(this.files);
      this.isLoadingLiterature = false;
    });
  }

  openDeleteConfirmationDialog(id: string, originalFileName: string) {
    const message = 'Are you sure you\'d like to delete ' + originalFileName;

    const dialogData = new ConfirmationDialogModel('Confirm deletion', message);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.isLoadingLiterature = true;
        this.publicationService.deleteLiteratureFile(this.publication.pmid, id).subscribe(() => {
          this.snackBar.open('File deleted.', '', {duration: 2500});
          this.getFiles();
        }, () => {
          this.isLoadingLiterature = false;
          this.snackBar.open('Error occurred on delete.', '', {duration: 2500});
        });
      }
    });
  }

  getFileNames() {
    return this.uploader.queue.map(file => file.file.name).join(', ');
  }

}
