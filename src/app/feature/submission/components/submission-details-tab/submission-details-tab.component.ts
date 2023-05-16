import { Component, Input, OnInit } from '@angular/core';
import { Submission } from '../../../../core/models/submission';
import { SubmissionService } from '../../../../core/services/submission.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  numberOfValidSnps = 0;
  numberOfApprovedSnps = 0;
  @Input('submission') set _submission(submission: Submission) {
    this.submission = submission;
    if (this.submission) {
      this.extractValidationErrors();
    }
    if (submission && submission.submission_status === 'DEPOSITION_COMPLETE' || submission.submission_status === 'CURATION_COMPLETE') {
      this.getSnpStatus();
    }
  }
  validationErrors: string[] = [];

  constructor(private submissionService: SubmissionService, private dialog: MatDialog, private snackbar: MatSnackBar) { }

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

  openConfirmationDialog(field: string, cb: MatCheckbox) {
    const message = field + ': ' + cb.checked;

    const dialogData = new ConfirmationDialogModel('Are you sure about this change?', message);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const submission: Submission = ({} as any) as Submission;
        submission.submissionId = this.submission.submissionId;
        if (field === 'Open Targets') { submission.opentargets_flag = cb.checked; }
        if (field === 'User Requested') { submission.userrequested_flag = cb.checked; }
        this.submissionService.patchSubmission(submission).subscribe((value) => {
          this.snackbar.open('Changes saved.', '', {duration: 2500});
          this.submission = value;
        }, () => {
          this.snackbar.open('Error occurred while saving flags.', '', {duration: 2500});
          if (field === 'Open Targets') { cb.checked = this.submission.opentargets_flag; }
          if (field === 'User Requested') { cb.checked = this.submission.userrequested_flag; }
        });
      }
      else {
        if (field === 'Open Targets') { cb.checked = this.submission.opentargets_flag; }
        if (field === 'User Requested') { cb.checked = this.submission.userrequested_flag; }
      }
    });
  }

  allowImport(status: string) {
    const submission: Submission = ({} as any) as Submission;
    submission.submissionId = this.submission.submissionId;
    submission.submission_status = 'SUBMITTED';
    if (status === 'CURATION_COMPLETE') {
      const dialogData = new ConfirmationDialogModel('Important', 'Please ensure you have unpublished any published studies before updating them.');
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        maxWidth: '700px',
        data: dialogData
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.submissionService.patchSubmission(submission).subscribe(value => {
            this.submission = value;
            this.snackbar.open('Import enabled.', '', {duration: 2500});
          });
        }
        else {
          return;
        }
      });
    }
    else {
      this.submissionService.patchSubmission(submission).subscribe(value => {
        this.submission = value;
        this.snackbar.open('Import enabled.', '', {duration: 2500});
      });
    }
  }


  getSnpStatus() {
    this.submissionService.getSnpStatus(this.submission.submissionId).subscribe((value) => {
      this.numberOfValidSnps = value.noValidSnps;
      this.numberOfApprovedSnps = value.noApprovedSnps;
    });
  }
}
