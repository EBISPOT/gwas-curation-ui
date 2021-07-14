import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { Submission } from '../../../../core/models/submission';
import { environment } from '../../../../../environments/environment';
import { SubmissionService } from '../../../../core/services/submission.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-submission-edit-tab',
  templateUrl: './submission-edit-tab.component.html',
  styleUrls: ['./submission-edit-tab.component.css']
})
export class SubmissionEditTabComponent implements OnInit {

  id: string;
  uploader: FileUploader;
  isChecked = false;
  hasDropZoneOver = false;
  submission: Submission;
  @Input('submission') set _submission(submission: Submission) {
    if (submission?.lockDetails?.status === 'LOCKED_FOR_EDITING') {
      this.isChecked = true;
    }
    this.submission = submission;
  }
  @Output() uploadSuccessEvent = new EventEmitter();
  constructor(private route: ActivatedRoute, private tokenService: TokenStorageService,
              private submissionService: SubmissionService, private snackBar: MatSnackBar) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.uploader = new FileUploader(
      {
        url: environment.CURATION_API_URL + '/submissions/' + this.id + '/uploads/edit', itemAlias: 'file',
        authToken: 'Bearer ' + tokenService.getToken()
      });
  }

  ngOnInit(): void {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      if (this.uploader.queue.length > 1) {
        this.uploader.cancelAll();
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
    };
    this.uploader.onSuccessItem = () => {
      this.snackBar.open('File was uploaded successfully.', '', {duration: 2500});
      this.uploadSuccessEvent.emit();
      this.submission.summary_statistics_status = 'VALIDATING';
      this.submission.metadata_status = 'VALIDATING';
    };
  }

  fileOver(e) {
    this.hasDropZoneOver = e;
  }

  sliderToggle() {
    this.uploader.cancelAll();
    this.uploader.clearQueue();
    this.submissionService
      .lockOrUnlock(this.id, this.isChecked)
      .subscribe(() => {}, () => {this.isChecked = !this.isChecked; });
  }

}
