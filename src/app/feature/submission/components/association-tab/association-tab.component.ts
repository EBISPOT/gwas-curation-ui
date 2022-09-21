import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubmissionService } from '../../../../core/services/submission.service';
import { Submission } from '../../../../core/models/submission';

@Component({
  selector: 'app-association-tab',
  templateUrl: './association-tab.component.html',
  styleUrls: ['./association-tab.component.css']
})
export class AssociationTabComponent implements OnInit {

  submissionId = this.route.snapshot.paramMap.get('id');
  numberOfValidSnps = 0;
  numberOfApprovedSnps = 0;
  isLoading = true;
  @Input()
  submission: Submission;
  @Output() approveSnpsEvent = new EventEmitter();

  constructor(private route: ActivatedRoute, private submissionService: SubmissionService) {
    this.isLoading = true;
    submissionService.getSnpStatus(this.submissionId).subscribe((value) => {
      this.isLoading = false;
      this.numberOfValidSnps = value.noValidSnps;
      this.numberOfApprovedSnps = value.noApprovedSnps;
    });
  }

  ngOnInit(): void {
  }

  approveSnps() {
    this.isLoading = true;
    this.submissionService.approveSnps(this.submissionId).subscribe(() => {
      this.submissionService.getSubmission(this.submissionId).subscribe(submission => {
        this.submissionService.getSnpStatus(this.submissionId).subscribe((value) => {
          this.isLoading = false;
          this.numberOfValidSnps = value.noValidSnps;
          this.numberOfApprovedSnps = value.noApprovedSnps;
          this.approveSnpsEvent.emit();
        });
        this.submission = submission;
      });
    });
  }

  downloadSnpValidationReport() {
    return this.submissionService.downloadSnpValidationReport(this.submissionId).subscribe((response: any) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', 'snp-validation-report.tsv');
      document.body.appendChild(link);
      link.click();
    });
  }

}
