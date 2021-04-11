import { Component, Input, OnInit } from '@angular/core';
import { Submission } from '../../../../core/models/submission';

@Component({
  selector: 'app-submission-details-tab',
  templateUrl: './submission-details-tab.component.html',
  styleUrls: ['./submission-details-tab.component.css']
})
export class SubmissionDetailsTabComponent implements OnInit {

  @Input() submission: Submission;
  constructor() { }

  ngOnInit(): void {
  }

}
