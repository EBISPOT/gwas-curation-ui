import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../../environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { ActivatedRoute } from '@angular/router';
import { SubmissionService } from '../../../../core/services/submission.service';

@Component({
  selector: 'app-sample-tab',
  templateUrl: './sample-tab.component.html',
  styleUrls: ['./sample-tab.component.css']
})
export class SampleTabComponent implements OnInit {

  submissionId = this.route.snapshot.paramMap.get('id');
  showSampleUpload = false;
  sampleUploader: FileUploader;
  hasDropZoneOver = false;

  constructor(private route: ActivatedRoute, private submissionService: SubmissionService, private tokenService: TokenStorageService) {
    this.sampleUploader = new FileUploader(
      {
        url: environment.CURATION_API_URL + '/submissions/' + this.submissionId + '/xxxxx', itemAlias: 'multipartFile',
        authToken: 'Bearer ' + tokenService.getToken()
      });
  }

  ngOnInit(): void {
  }

  sampleUploadFileOver(e) {
    this.hasDropZoneOver = e;
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
}
