import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EpmcImportResult } from '../../../../core/models/rest/api-responses/epmcImportResult';
import { PublicationService } from '../../../../core/services/publication.service';
import { MatDialog } from '@angular/material/dialog';
import {
  CheckSubmissionDialogComponent
} from '../../components/check-submission-dialog/check-submission-dialog.component';

@Component({
  selector: 'app-import-publication',
  templateUrl: './import-publication.component.html',
  styleUrls: ['./import-publication.component.css']
})
export class ImportPublicationComponent implements OnInit, AfterViewInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  pmids: string[] = [];
  displayedColumns: string[] = ['pmid', 'author', 'title', 'journal', 'result', 'checkSubmission'];
  importResultArray: EpmcImportResult[];
  dataSource = new MatTableDataSource<EpmcImportResult>();
  importInProgress = false;
  resultsLength = 0;
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  constructor(private publicationService: PublicationService, private dialog: MatDialog) { }

  ngAfterViewInit() {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.pmids.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  remove(pmid: string): void {
    const index = this.pmids.indexOf(pmid);

    if (index >= 0) {
      this.pmids.splice(index, 1);
    }
  }

  ngOnInit(): void {
  }

  handlePaste($event: ClipboardEvent) {
    $event.preventDefault();
    $event.clipboardData
      .getData('Text')
      .split(/ |,|\n/)
      .forEach(value => {
        if (value.trim()){
          this.pmids.push(value.trim());
        }
      });
  }

  import() {
    this.importResultArray = [];
    this.importInProgress = true;
    this.resultsLength = 0;
    this.publicationService
      .importPublicationsFromEpmc(this.pmids)
      .subscribe((value: EpmcImportResult[]) => {
        this.importInProgress = false;
        this.importResultArray = value;
        this.dataSource = new MatTableDataSource<EpmcImportResult>(this.importResultArray);
        this.resultsLength = this.importResultArray.length;
      }, (error) => {
        this.importInProgress = false;
      });
  }

  openCheckSubmissionDialog(pmid: string) {
    this.dialog.open(CheckSubmissionDialogComponent, {
      autoFocus: false,
      data: {
        pubmedId: pmid
      }
    });
  }
}
