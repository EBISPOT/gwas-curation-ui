import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../../environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { ActivatedRoute } from '@angular/router';
import { SubmissionService } from '../../../../core/services/submission.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Sample } from '../../../../core/models/sample';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-sample-tab',
  templateUrl: './sample-tab.component.html',
  styleUrls: ['./sample-tab.component.css']
})
export class SampleTabComponent implements OnInit, AfterViewInit {

  submissionId = this.route.snapshot.paramMap.get('id');
  showSampleUpload = false;
  sampleUploader: FileUploader;
  hasDropZoneOver = false;
  report: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  isLoadingResults = true;
  dataSource: MatTableDataSource<Sample>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  resultsLength = 0;
  displayedColumns: string[] = ['GCST', 'studyTag', 'initialSampleDescription', 'replicateSampleDescription'];

  constructor(private route: ActivatedRoute, private submissionService: SubmissionService, private tokenService: TokenStorageService,
              private snackBar: MatSnackBar) {

    this.sampleUploader = new FileUploader(
      {
        url: environment.CURATION_API_URL + '/submissions/' + this.submissionId + '/studies/sampledescription/files', itemAlias: 'multipartFile',
        authToken: 'Bearer ' + tokenService.getToken()
      });
  }

  ngOnInit(): void {

    this.sampleUploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.report = null;
      if (this.sampleUploader.queue.length > 1) {
        this.sampleUploader.cancelAll();
        this.sampleUploader.removeFromQueue(this.sampleUploader.queue[0]);
      }
    };
    this.sampleUploader.onSuccessItem = (item, response) => {
      this.snackBar.open('Traits file was uploaded successfully.', '', {duration: 2500});
      this.report = response;
      this.sampleUploader.clearQueue();
      this.fileInput.nativeElement.value = '';
      this.reloadSamples();
    };
    this.sampleUploader.onErrorItem = () => {
      this.snackBar.open('An unexpected error occurred while uploading traits.', '', {duration: 2500});
    };
  }

  sampleUploadFileOver(e) {

    this.hasDropZoneOver = e;
  }

  ngAfterViewInit() {

    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.submissionService
            .getSubmissionSamples(this.paginator.pageSize, this.paginator.pageIndex,
              this.sort.active, this.sort.direction, this.submissionId);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.page.totalElements;
          return data._embedded.studySampleDescPatchRequests;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        })
      )
      .subscribe(value => {
        this.dataSource = new MatTableDataSource<Sample>(value);
      });
  }

  reloadSamples() {

    this.isLoadingResults = true;
    this.submissionService
      .getSubmissionSamples(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active, this.sort.direction, this.submissionId)
      .subscribe(value => {
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource<Sample>(value._embedded.studySampleDescPatchRequests);
      });
  }

  resetPaging(): void {

    this.paginator.pageIndex = 0;
  }

  downloadSamplesPrefilledTemplate() {

    this.submissionService.downloadSamplesPrefilledTemplate(this.submissionId).subscribe((response: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', 'study-samples-bulk-upload.tsv');
      document.body.appendChild(link);
      link.click();
    });
  }

  downloadSampleUploadReport() {

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([this.report]));
    link.setAttribute('download', 'study-trait-bulk-report.tsv');
    document.body.appendChild(link);
    link.click();
  }
}
