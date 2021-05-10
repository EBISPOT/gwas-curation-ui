import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { VersioningComponent } from '../versioning/versioning.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-submission-history-tab',
  templateUrl: './submission-history-tab.component.html',
  styleUrls: ['./submission-history-tab.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px'})),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class SubmissionHistoryTabComponent {

  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  expandedElement: PeriodicElement | null;

  constructor(public dialog: MatDialog) {
  }

  openDialog() {
    this.dialog.open(VersioningComponent, {width: '100%'});
  }

}

export interface PeriodicElement {
  name: string;
  weight: string;
  symbol: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'Stein_submission_final.xlsx',
    weight: '27-10-2021',
    symbol: 'H',
    description: `1 study added [Stu_tag3], 2 studies removed [Stu_tag1, Stu_tag2], 3 associations edited [Stu_tag8, Stu_tag6].`
  }, {
    name: 'Stein_submission_v3.xlsx',
    weight: '17-10-2021',
    symbol: 'He',
    description: `1 study added [Stu_tag3], 2 studies removed [Stu_tag1, Stu_tag2], 3 associations edited [Stu_tag8, Stu_tag6].`
  }, {
    name: 'Stein_submission_v2.1.xlsx',
    weight: '25-09-2021',
    symbol: 'Li',
    description: `1 study added [Stu_tag3], 2 studies removed [Stu_tag1, Stu_tag2], 3 associations edited [Stu_tag8, Stu_tag6].`
  }, {
    name: 'Stein_submission_v2.xlsx',
    weight: '25-09-2021',
    symbol: 'Be',
    description: `1 study added [Stu_tag3], 2 studies removed [Stu_tag1, Stu_tag2], 3 associations edited [Stu_tag8, Stu_tag6].`
  }, {
    name: 'Stein_sub_file.xlsx',
    weight: '25-09-2021',
    symbol: 'B',
    description: `1 study added [Stu_tag3], 2 studies removed [Stu_tag1, Stu_tag2], 3 associations edited [Stu_tag8, Stu_tag6].`
  }, {
    name: 'new_Stein_submission.xlsx',
    weight: '13-05-2021',
    symbol: 'C',
    description: `1 study added [Stu_tag3], 2 studies removed [Stu_tag1, Stu_tag2], 3 associations edited [Stu_tag8, Stu_tag6].`
  }, {
    name: 'Stein_sub_new.xlsx',
    weight: '13-05-2021',
    symbol: 'N',
    description: `1 study added [Stu_tag3], 2 studies removed [Stu_tag1, Stu_tag2], 3 associations edited [Stu_tag8, Stu_tag6].`
  }, {
    name: 'Stein_submission.xlsx',
    weight: '03-12-2020',
    symbol: 'O',
    description: `1 study added [Stu_tag3], 2 studies removed [Stu_tag1, Stu_tag2], 3 associations edited [Stu_tag8, Stu_tag6].`
  }
];
