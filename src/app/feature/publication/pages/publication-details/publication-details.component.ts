import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../../../core/services/publication.service';
import { ActivatedRoute } from '@angular/router';
import { Publication } from '../../../../core/models/publication';
import { Submission } from '../../../../core/models/submission';
import { BodyOfWork } from '../../../../core/models/bodyOfWork';
import { SubmissionService } from '../../../../core/services/submission.service';

@Component({
  selector: 'app-publication-details',
  templateUrl: './publication-details.component.html',
  styleUrls: ['./publication-details.component.css']
})
export class PublicationDetailsComponent implements OnInit {
  publication: Publication;
  bodyOfWork: BodyOfWork;
  submissions: {submission: Submission, isLoading: boolean}[] = [];
  publicationId: string;
  isLoadingPublication = true;
  isLoadingBoW = true;

  constructor(private route: ActivatedRoute, private publicationService: PublicationService,
              private submissionService: SubmissionService) { }

  ngOnInit(): void {
    this.publicationId = this.route.snapshot.paramMap.get('publicationId');
    this.publicationService.getPublication(this.publicationId).subscribe(publication => {
      this.publication = publication;
      this.isLoadingPublication = false;
      if (this.publication.bodyOfWorkId) {
        this.publicationService.getBodyOfWork(this.publication.bodyOfWorkId).subscribe(bodyOfWork => {
          this.bodyOfWork = bodyOfWork;
          this.isLoadingBoW = false;
        });
      }
      if (this.publication.submissionIds) {
        for (const [index, submissionId] of this.publication.submissionIds.entries()) {
          this.submissions.push({submission: null, isLoading: true});
          this.submissionService.getSubmission(submissionId).subscribe(submission => {
            this.submissions[index] = {submission, isLoading: false};
          });
        }
      }
    });
  }

}
