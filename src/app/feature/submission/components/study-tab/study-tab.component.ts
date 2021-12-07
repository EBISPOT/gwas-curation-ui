import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Study } from '../../../../core/models/study';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-study-tab',
  templateUrl: './study-tab.component.html',
  styleUrls: ['./study-tab.component.css']
})
export class StudyTabComponent implements OnInit {

  dataSource: MatTableDataSource<Study>;
  displayedColumns: string[] = ['study_tag', 'study_accession'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  submissionId = this.route.snapshot.paramMap.get('id');

  constructor(private route: ActivatedRoute) {
    console.log(this.submissionId);
  }

  ngOnInit(): void {
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  getSubmissionStudies() {


  }

}
