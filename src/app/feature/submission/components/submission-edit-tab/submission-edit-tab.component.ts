import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submission-edit-tab',
  templateUrl: './submission-edit-tab.component.html',
  styleUrls: ['./submission-edit-tab.component.css']
})
export class SubmissionEditTabComponent implements OnInit {

  id: string;
  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
  }

}
