import { Component, OnDestroy, OnInit } from '@angular/core';
import { Submission } from '../../../../core/models/submission';
import { Observable, Subject, timer } from 'rxjs';
import { retry, switchMap, takeUntil } from 'rxjs/operators';
import { SubmissionService } from '../../../../core/services/submission.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submission-details',
  templateUrl: './submission-details.component.html',
  styleUrls: ['./submission-details.component.css']
})
export class SubmissionDetailsComponent implements OnInit, OnDestroy {

  submission: Submission;
  id: string;
  timerSubmissionObservable: Observable<Submission>;
  stopPolling = new Subject();
  constructor(private submissionService: SubmissionService, private route: ActivatedRoute) {
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
      if (value.submission_status == null || value.submission_status === 'VALID' || value.submission_status === 'INVALID' ||
        value.submission_status === 'CURATION_COMPLETE' || value.submission_status === 'COMPLETE' ||
        value.submission_status === 'STARTED' || value.submission_status === 'SUBMITTED') {
        this.stopPolling.next();
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stopPolling.next();
  }

}