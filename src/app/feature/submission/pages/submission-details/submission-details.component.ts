import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Submission } from '../../../../core/models/submission';
import { Observable, Subject, timer } from 'rxjs';
import { retry, switchMap, takeUntil } from 'rxjs/operators';
import { SubmissionService } from '../../../../core/services/submission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { SubmissionHistoryTabComponent } from '../../components/submission-history-tab/submission-history-tab.component';

@Component({
  selector: 'app-submission-details',
  templateUrl: './submission-details.component.html',
  styleUrls: ['./submission-details.component.css']
})
export class SubmissionDetailsComponent implements OnInit, OnDestroy {

  @ViewChild(SubmissionHistoryTabComponent) historyTabCmp: SubmissionHistoryTabComponent;
  submission: Submission;
  id: string;
  disableEdit: boolean;
  timerSubmissionObservable: Observable<Submission>;
  stopPolling = new Subject();
  constructor(private submissionService: SubmissionService, private route: ActivatedRoute,
              private authService: AuthService, private router: Router) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.timerSubmissionObservable = timer(1, 5000).pipe(
      switchMap(() => submissionService.getSubmission(this.id)),
      retry(10),
      takeUntil(this.stopPolling)
    );
    this.pollUntilStatusIsNotValidating();
  }

  pollUntilStatusIsNotValidating() {
    this.timerSubmissionObservable.subscribe(value => {
      this.submission = value;
      if (this.submission.lockDetails && this.submission.lockDetails.status === 'LOCKED_FOR_EDITING'
        && this.submission.lockDetails.lockedBy.user.email !== this.authService.getDecodedToken().email
        || this.submission.submission_status === 'STARTED') {
        this.disableEdit = true;
      }
      if (value.submission_status == null || value.submission_status === 'VALID' || value.submission_status === 'INVALID'
        || value.submission_status === 'CURATION_COMPLETE' || value.submission_status === 'COMPLETE'
        || value.submission_status === 'STARTED' || value.submission_status === 'SUBMITTED') {
        this.stopPolling.next();
        this.historyTabCmp.loadHistory();
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stopPolling.next();
  }

  returnToSubList() {
    this.router.navigateByUrl('submissions');
  }
}
