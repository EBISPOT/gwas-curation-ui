import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../../environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Publication } from '../../../../core/models/publication';
import { PublicationService } from '../../../../core/services/publication.service';

@Component({
  selector: 'app-literature-tab',
  templateUrl: './literature-tab.component.html',
  styleUrls: ['./literature-tab.component.css']
})
export class LiteratureTabComponent implements OnInit {
  dataSource: MatTableDataSource<{id: string, fileName: string, createdBy: string, createDate: string}>;
  uploader: FileUploader;
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input()
  publication: Publication;
  files = [];
  isLoadingLiterature = true;

  constructor(private tokenService: TokenStorageService, private snackBar: MatSnackBar, private publicationService: PublicationService) {
  }

  ngOnInit(): void {
    this.uploader = new FileUploader({
      url: environment.CURATION_API_URL + '/publications/' + this.publication?.pmid + '/literature-files', itemAlias: 'multipartFile',
      authToken: 'Bearer ' + this.tokenService.getToken(),
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      if (this.uploader.queue.length > 1) {
        this.uploader.cancelAll();
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
    };
    this.uploader.onSuccessItem = (item, response) => {
      this.isLoadingLiterature = true;
      this.snackBar.open('Literature file was uploaded successfully.', '', {duration: 2500});
      this.uploader.clearQueue();
      this.fileInput.nativeElement.value = '';
      this.getFiles();
      // todo reload lit files, remove onSuccess/Error unused args
    };

    this.uploader.onErrorItem = (item, response) => {
      this.isLoadingLiterature = false;
      this.snackBar.open('An unexpected error occurred while uploading literature.', '', {duration: 2500});
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
    this.publicationService.getLiteratureFiles(this.publication?.pmid).subscribe(resp => {
      this.files = resp?._embedded ? resp?._embedded['literature-files'] : [];
      this.dataSource = new MatTableDataSource(this.files);
      this.isLoadingLiterature = false;
    });
  }

}
