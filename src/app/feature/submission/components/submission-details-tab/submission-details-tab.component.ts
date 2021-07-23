import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Submission } from '../../../../core/models/submission';
import { SubmissionService } from '../../../../core/services/submission.service';
import { FileUpload } from '../../../../core/models/fileUpload';
import { log } from 'util';

@Component({
  selector: 'app-submission-details-tab',
  templateUrl: './submission-details-tab.component.html',
  styleUrls: ['./submission-details-tab.component.css']
})
export class SubmissionDetailsTabComponent implements OnInit, OnChanges {

  @Input() submission: Submission;
  validationErrors: string[] = [];

  ngOnChanges(changes) {
    if (this.submission != null) {
      this.extractValidationErrors();
    }
  }

  constructor(private submissionService: SubmissionService) { }

  ngOnInit(): void {
  }

  downloadTemplate() {
    let ssFileId: string;
    let mdFileId: string;
    let fileName: string;
    for (const f of this.submission.files) {
      if (f.type === 'SUMMARY_STATS') {
        ssFileId = f.fileUploadId;
        fileName = f.fileName;
      }
      else if (f.type === 'METADATA') {
        mdFileId = f.fileUploadId;
        fileName = f.fileName;
      }
    }
    this.submissionService
      .downloadTemplate(this.submission.submissionId, ssFileId ? ssFileId : mdFileId)
      .subscribe((response: any) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([response]));
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      });
  }

  goToPreprintDoi() {
    window.open(this.submission.bodyOfWork.preprintServerDOI, '_blank');
  }

  extractValidationErrors() {
    if (this.submission.files != null) {
      for (const file of this.submission.files) {
        if (file.errors.length > 0) {
          this.validationErrors = this.validationErrors.concat(file.errors);
        }
      }
    }
  }
}
