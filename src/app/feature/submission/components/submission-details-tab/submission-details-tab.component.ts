import { Component, Input, OnInit } from '@angular/core';
import { Submission } from '../../../../core/models/submission';
import { SubmissionService } from '../../../../core/services/submission.service';

@Component({
  selector: 'app-submission-details-tab',
  templateUrl: './submission-details-tab.component.html',
  styleUrls: ['./submission-details-tab.component.css']
})
export class SubmissionDetailsTabComponent implements OnInit {

  showSubmission = true;
  showPublication = true;
  showBodyOfWork = true;

  submission: Submission;
  @Input('submission') set _submission(submission: Submission) {
    this.submission = submission;
    if (this.submission) {
      this.extractValidationErrors();
    }
  }
  validationErrors: string[] = [];

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
    this.validationErrors = [];
    if (this.submission.files != null) {
      for (const file of this.submission.files) {
        if (file.errors.length > 0) {
          this.validationErrors = this.validationErrors.concat(file.errors);
        }
      }
    }
  }

  toggleDisplay(compType: string) {
    if (compType === 'showSubmission') {
      this.showSubmission = (this.showSubmission !== true);
    } else if (compType === 'showPublication') {
      this.showPublication = (this.showPublication !== true);
    } else if (compType === 'showBodyOfWork') {
      this.showBodyOfWork = (this.showBodyOfWork !== true);
    }
  }
}
