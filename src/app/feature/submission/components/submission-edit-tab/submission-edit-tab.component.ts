import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { Submission } from '../../../../core/models/submission';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-submission-edit-tab',
  templateUrl: './submission-edit-tab.component.html',
  styleUrls: ['./submission-edit-tab.component.css']
})
export class SubmissionEditTabComponent implements OnInit {

  id: string;
  uploader: FileUploader;
  @Input() submission: Submission;
  @Output() uploadSuccessEvent = new EventEmitter();
  constructor(private route: ActivatedRoute, private tokenService: TokenStorageService) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.uploader = new FileUploader(
      {
        url: environment.API_URL + '/submissions/' + this.id + '/uploads/edit', itemAlias: 'file',
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
      this.uploadSuccessEvent.emit();
      this.submission.summary_statistics_status = 'VALIDATING';
      this.submission.metadata_status = 'VALIDATING';
    };
  }

}
