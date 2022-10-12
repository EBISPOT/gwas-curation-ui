import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Study } from '../../../../core/models/study';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { SubmissionService } from '../../../../core/services/submission.service';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSidenav } from '@angular/material/sidenav';
import { ReportedTraitService } from '../../../../core/services/reported-trait.service';
import { ReportedTrait } from '../../../../core/models/reportedTrait';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../../environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EfoTrait } from '../../../../core/models/efoTrait';
import { EfoTraitService } from '../../../../core/services/efo-trait.service';

@Component({
  selector: 'app-study-tab',
  templateUrl: './study-tab.component.html',
  styleUrls: ['./study-tab.component.css']
})
export class StudyTabComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<Study>;
  resultsLength = 0;
  isLoadingResults = true;
  displayedColumns: string[] = ['study_accession', 'study_tag', 'genotyping_technology', 'array_manufacturer', 'array_information', 'imputation', 'variant_count', 'statistical_model', 'study_description', 'disease_trait', 'efo', 'background_efo', 'sumstats_file', 'cohort'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  submissionId = this.route.snapshot.paramMap.get('id');
  openedGcst: number;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  traitCtrl = new FormControl();
  efoTraitCtrl = new FormControl();
  bgEfoTraitCtrl = new FormControl();
  reportedTraits: ReportedTrait[] = [];
  efoTraits: EfoTrait[] = [];
  bgEfoTraits: EfoTrait[] = [];
  reportedTraitsDropdownItems: ReportedTrait[] = [];
  efoTraitsDropdownItems: EfoTrait[] = [];
  bgEfoTraitsDropdownItems: EfoTrait[] = [];
  @ViewChild('reportedTraitInput') reportedTraitInput: ElementRef;
  @ViewChild('efoTraitInput') efoTraitInput: ElementRef;
  @ViewChild('bgEfoTraitInput') bgEfoTraitInput: ElementRef;
  @ViewChild('sidenav') sidenav: MatSidenav;
  isLoadingSidenav: boolean;
  sidenavStudy: Study;
  showTraitUpload = false;
  showEfoUpload = false;
  traitUploader: FileUploader;
  efoUploader: FileUploader;
  hasDropZoneOver = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('efoFileInput') efoFileInput: ElementRef;
  report: any;
  efoReport: any;
  uploadError: any;

  constructor(private route: ActivatedRoute, private submissionService: SubmissionService, private snackBar: MatSnackBar,
              private reportedTraitService: ReportedTraitService, private efoTraitService: EfoTraitService, private tokenService: TokenStorageService) {
    this.traitUploader = new FileUploader(
      {
        url: environment.CURATION_API_URL + '/submissions/' + this.submissionId + '/studies/multi-traits/files', itemAlias: 'multipartFile',
        authToken: 'Bearer ' + tokenService.getToken()
      });

    this.efoUploader = new FileUploader(
      {
        url: environment.CURATION_API_URL + '/submissions/' + this.submissionId + '/studies/efo-traits/files', itemAlias: 'multipartFile',
        authToken: 'Bearer ' + tokenService.getToken()
      });
  }

  ngOnInit(): void {

    this.traitUploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.report = null;
      this.uploadError = null;
      if (this.traitUploader.queue.length > 1) {
        this.traitUploader.cancelAll();
        this.traitUploader.removeFromQueue(this.traitUploader.queue[0]);
      }
    };
    this.traitUploader.onSuccessItem = (item, response) => {
      this.uploadError = null;
      this.snackBar.open('Traits file was uploaded successfully.', '', {duration: 2500});
      this.report = JSON.parse(response);
      this.traitUploader.clearQueue();
      this.fileInput.nativeElement.value = '';
      this.reloadStudies();
    };
    this.traitUploader.onErrorItem = (item, response) => {
      const prefix = 'FileProcessingException:';
      const message = JSON.parse(response).message;
      this.uploadError = message.slice(message.indexOf(prefix) + prefix.length);
      this.snackBar.open('An unexpected error occurred while uploading traits.', '', {duration: 2500});
    };

    this.efoUploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.efoReport = null;
      if (this.efoUploader.queue.length > 1) {
        this.efoUploader.cancelAll();
        this.efoUploader.removeFromQueue(this.efoUploader.queue[0]);
      }
    };
    this.efoUploader.onSuccessItem = (item, response) => {
      this.snackBar.open('Traits file was uploaded successfully.', '', {duration: 2500});
      this.efoReport = response;
      this.efoUploader.clearQueue();
      this.efoFileInput.nativeElement.value = '';
      this.reloadStudies();
    };
    this.efoUploader.onErrorItem = () => {
      this.snackBar.open('An unexpected error occurred while uploading traits.', '', {duration: 2500});
    };
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  traitUploadFileOver(e) {
    this.hasDropZoneOver = e;
  }

  ngAfterViewInit() {
    // add this.sort.sortChange to merge() params and delete datasource.sort = sort in subscribe() to enable server-side sorting
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.submissionService
            .getSubmissionStudies(this.paginator.pageSize, this.paginator.pageIndex,
              this.sort.active, this.sort.direction, this.submissionId);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.page.totalElements;
          return data._embedded.studies;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        })
      )
      .subscribe(value => {
        for (const study of value) {
          study.efo_trait = '';
          study.background_efo_trait = '';
          for (const efo of study.efoTraits) {
            study.efo_trait = study.efo_trait + efo.trait + ' | ';
          }
          study.efo_trait = study.efo_trait.substring(0, study.efo_trait.length - 3);
          for (const efo of study.backgroundEfoTraits) {
            study.background_efo_trait = study.background_efo_trait + efo.trait + ' | ';
          }
          study.background_efo_trait = study.background_efo_trait.substring(0, study.background_efo_trait.length - 3);
        }
        this.dataSource = new MatTableDataSource<Study>(value);
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

    fromEvent(this.bgEfoTraitInput.nativeElement, 'input').pipe()
      .pipe(map((event: Event) => (event.target as HTMLInputElement).value))
      .pipe(debounceTime(1000))
      .pipe(distinctUntilChanged())
      .subscribe(data => {
        this.efoTraitService.getTraits(50, 0, 'trait', 'asc', data).subscribe(value => {
          if (value?._embedded?.efoTraits) {
            this.bgEfoTraitsDropdownItems = value._embedded.efoTraits;
          }
          else {
            this.bgEfoTraitsDropdownItems = [];
          }
        });
      });
  }

  getSubmissionStudies() {

    this.submissionService.getSubmissionStudies(this.paginator.pageSize, this.paginator.pageIndex,
      this.sort.active, this.sort.direction, this.submissionId).subscribe((v) => {
        console.log(v);
    });
  }

  remove(trait: ReportedTrait): void {
    const index = this.reportedTraits.indexOf(trait);

    if (index >= 0) {
      this.reportedTraits.splice  (index, 1);
    }
  }

  removeEfo(trait: EfoTrait): void {
    const index = this.efoTraits.indexOf(trait);

    if (index >= 0) {
      this.efoTraits.splice  (index, 1);
    }
  }

  removeBgEfo(trait: EfoTrait): void {
    const index = this.bgEfoTraits.indexOf(trait);

    if (index >= 0) {
      this.bgEfoTraits.splice  (index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.reportedTraits[0] = event.option.value;
    this.reportedTraitInput.nativeElement.value = '';
    this.traitCtrl.setValue(null);
  }

  selectedEfo(event: MatAutocompleteSelectedEvent): void {
    if (this.efoTraits.indexOf(event.option.value) < 0) {
      this.efoTraits.push(event.option.value);
    }
    this.efoTraitInput.nativeElement.value = '';
    this.efoTraitCtrl.setValue(null);
  }

  selectedBgEfo(event: MatAutocompleteSelectedEvent): void {
    if (this.bgEfoTraits.indexOf(event.option.value) < 0) {
      this.bgEfoTraits.push(event.option.value);
    }
    this.bgEfoTraitInput.nativeElement.value = '';
    this.bgEfoTraitCtrl.setValue(null);
  }

  openSidenav(id: string) {

    // open sidenav
    this.sidenav.open().then();
    // loading
    this.isLoadingSidenav = true;
    // get study
    this.submissionService.getStudy(this.submissionId, id).subscribe((value: Study) => {
      this.sidenavStudy = value;
      this.reportedTraits = [];
      if (this.sidenavStudy.diseaseTrait) {
        this.reportedTraits[0] = this.sidenavStudy.diseaseTrait;
      }
      this.efoTraits = this.sidenavStudy.efoTraits;
      this.bgEfoTraits = this.sidenavStudy.backgroundEfoTraits;
      this.isLoadingSidenav = false;
    });
  }

  // makeReportedTraitsString(arr: ReportedTrait[]) {
  //
  //   return arr.map(value => value.trait).join(', ');
  // }

  saveReportedTraits() {

    let trait: ReportedTrait = null;
    this.isLoadingSidenav = true;
    if (this.reportedTraits.length > 0) {
      trait = this.reportedTraits[0];
    }
    this.submissionService.editReportedTraits(trait, this.submissionId, this.sidenavStudy)
      .subscribe((v) => {
        this.sidenavStudy = v;
        this.isLoadingSidenav = false;
        this.reloadStudies();
      });
  }

  saveEfoTraits() {

    this.isLoadingSidenav = true;

    this.submissionService.editEfoTraits(this.efoTraits, this.submissionId, this.sidenavStudy)
      .subscribe((v) => {
        this.sidenavStudy = v;
        this.isLoadingSidenav = false;
        this.reloadStudies();
      });
  }


  saveBgEfoTraits() {
    this.isLoadingSidenav = true;

    this.submissionService.editBgEfoTraits(this.bgEfoTraits, this.submissionId, this.sidenavStudy)
      .subscribe((v) => {
        this.sidenavStudy = v;
        this.isLoadingSidenav = false;
        this.reloadStudies();
      });
  }

  downloadBulkStudyMultiTraitUploadTemplate() {

    this.submissionService.downloadBulkStudyMultiTraitUploadTemplate().subscribe((response: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', 'study-multi-trait-bulk-upload.tsv');
      document.body.appendChild(link);
      link.click();
    });
  }

  downloadBulkStudyTraitUploadTemplate() {

    this.submissionService.downloadBulkStudyTraitUploadTemplate().subscribe((response: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', 'study-trait-bulk-upload.tsv');
      document.body.appendChild(link);
      link.click();
    });
  }

  downloadBulkStudyEfoUploadTemplate() {

    this.submissionService.downloadBulkStudyEfoUploadTemplate().subscribe((response: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', 'study-efo-bulk-upload.tsv');
      document.body.appendChild(link);
      link.click();
    });
  }

  reloadStudies() {

    this.isLoadingResults = true;
    this.submissionService
      .getSubmissionStudies(this.paginator.pageSize, this.paginator.pageIndex, this.sort.active, this.sort.direction, this.submissionId)
      .subscribe(value => {
        for (const study of value._embedded.studies) {
          study.efo_trait = '';
          study.background_efo_trait = '';
          for (const efo of study.efoTraits) {
            study.efo_trait = study.efo_trait + efo.trait + ' | ';
          }
          study.efo_trait = study.efo_trait.substring(0, study.efo_trait.length - 3);
          for (const efo of study.backgroundEfoTraits) {
            study.background_efo_trait = study.background_efo_trait + efo.trait + ' | ';
          }
          study.background_efo_trait = study.background_efo_trait.substring(0, study.background_efo_trait.length - 3);
        }
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource<Study>(value._embedded.studies);
      });
  }

  downloadStudyTraitMappingReport() {

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([atob(this.report.uploadReport)]));
    link.setAttribute('download', 'study-trait-bulk-report.tsv');
    document.body.appendChild(link);
    link.click();
  }

  downloadStudyEfoMappingReport() {

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([this.efoReport]));
    link.setAttribute('download', 'study-efo-bulk-report.tsv');
    document.body.appendChild(link);
    link.click();
  }
}
