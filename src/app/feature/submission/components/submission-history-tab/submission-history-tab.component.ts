import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { VersioningComponent } from '../versioning/versioning.component';
import { MatDialog } from '@angular/material/dialog';
import { SubmissionService } from '../../../../core/services/submission.service';
import { SubmissionHistory } from '../../../../core/models/submissionHistory';
import { ActivatedRoute } from '@angular/router';

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
export class SubmissionHistoryTabComponent implements OnInit{

  columnsToDisplay = ['fileName', 'studiesTotal', 'associationsTotal', 'samplesTotal', 'download', 'diff'];
  expandedElement: SubmissionHistory | null;
  dataSource: SubmissionHistory[];
  historySummaryReports: string[];
  responseText = '';
  submissionId = this.route.snapshot.paramMap.get('id');
  isLoading = true;

  constructor(public dialog: MatDialog, private submissionService: SubmissionService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    /*this.submissionService
      .getSubmissionHistory(this.route.snapshot.paramMap.get('id'))
      .subscribe(h => {
        this.dataSource = h;
        this.historySummaryReports = this.submissionService.generateSubmissionHistorySummaryReports(h);
      });
    {
      this.dataSource = JSON.parse('[\n' +
        '    {\n' +
        '      "fileId": "ae12bc-eee33-eaf32...",\n' +
        '      "fileName": "Stein_Submission.xlsx",\n' +
        '      "uploadDate": "2021-08-12T20:17:46.384Z",\n' +
        '      "studies": [\n' +
        '        {\n' +
        '          "total": 123,\n' +
        '          "added": [\n' +
        '            "study_tag1",\n' +
        '            "study_tag2",\n' +
        '            "..."\n' +
        '          ],\n' +
        '          "removed": [\n' +
        '            "study_tag1",\n' +
        '            "study_tag2",\n' +
        '            "..."\n' +
        '          ],\n' +
        '          "tags": [\n' +
        '            {\n' +
        '              "tag": "study_tag1",\n' +
        '              "associations": {\n' +
        '                "added": 4,\n' +
        '                "removed": 2,\n' +
        '                "edited": [\n' +
        '                  {\n' +
        '                    "columnName": "$Association_Tab_Column_Name1",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  },\n' +
        '                  {\n' +
        '                    "columnName": "$Association_Tab_Column_Name2",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  }\n' +
        '                ]\n' +
        '              },\n' +
        '              "samples": {\n' +
        '                "added": 3,\n' +
        '                "removed": 1,\n' +
        '                "edited": [\n' +
        '                  {\n' +
        '                    "columnName": "$Sample_Tab_Column_Name1",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  }\n' +
        '                ]\n' +
        '              },\n' +
        '              "edited": [\n' +
        '                {\n' +
        '                  "columnName": "$Study_Tab_Column_Name1",\n' +
        '                  "previous": "...",\n' +
        '                  "new": "..."\n' +
        '                },\n' +
        '                {\n' +
        '                  "columnName": "$Study_Tab_Column_Name2",\n' +
        '                  "previous": "...",\n' +
        '                  "new": "..."\n' +
        '                }\n' +
        '              ]\n' +
        '            },\n' +
        '            {\n' +
        '              "tag": "study_tag2",\n' +
        '              "associations": {\n' +
        '                "added": 0,\n' +
        '                "removed": 0,\n' +
        '                "edited": [\n' +
        '                  {\n' +
        '                    "columnName": "$Association_Tab_Column_Name3",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  }\n' +
        '                ]\n' +
        '              },\n' +
        '              "samples": {\n' +
        '                "added": 3,\n' +
        '                "removed": 1,\n' +
        '                "edited": [\n' +
        '                  {\n' +
        '                    "columnName": "$Sample_Tab_Column_Name1",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  },\n' +
        '                  {\n' +
        '                    "columnName": "$Sample_Tab_Column_Name2",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  }\n' +
        '                ]\n' +
        '              }\n' +
        '            }\n' +
        '          ]\n' +
        '        }\n' +
        '      ]\n' +
        '    },\n' +
        '    {\n' +
        '      "fileId": "ae12bc-eee33-eaf32...",\n' +
        '      "fileName": "Stein_Submission_v2.xlsx",\n' +
        '      "uploadDate": "2021-08-11T20:17:46.384Z",\n' +
        '      "studies": [\n' +
        '        {\n' +
        '          "total": 123,\n' +
        '          "added": [\n' +
        '            "study_tag1",\n' +
        '            "study_tag4",\n' +
        '            "study_tag6",\n' +
        '            "..."\n' +
        '          ],\n' +
        '          "removed": [\n' +
        '            "study_tag8",\n' +
        '            "..."\n' +
        '          ],\n' +
        '          "tags": [\n' +
        '            {\n' +
        '              "tag": "study_tag6",\n' +
        '              "associations": {\n' +
        '                "added": 4,\n' +
        '                "removed": 2,\n' +
        '                "edited": [\n' +
        '                  {\n' +
        '                    "columnName": "$Association_Tab_Column_Name1",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  },\n' +
        '                  {\n' +
        '                    "columnName": "$Association_Tab_Column_Name2",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  }\n' +
        '                ]\n' +
        '              },\n' +
        '              "samples": {\n' +
        '                "added": 3,\n' +
        '                "removed": 1,\n' +
        '                "edited": [\n' +
        '                  {\n' +
        '                    "columnName": "$Sample_Tab_Column_Name1",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  }\n' +
        '                ]\n' +
        '              },\n' +
        '              "edited": [\n' +
        '                {\n' +
        '                  "columnName": "$Study_Tab_Column_Name1",\n' +
        '                  "previous": "...",\n' +
        '                  "new": "..."\n' +
        '                },\n' +
        '                {\n' +
        '                  "columnName": "$Study_Tab_Column_Name2",\n' +
        '                  "previous": "...",\n' +
        '                  "new": "..."\n' +
        '                }\n' +
        '              ]\n' +
        '            },\n' +
        '            {\n' +
        '              "tag": "study_tag2",\n' +
        '              "associations": {\n' +
        '                "added": 0,\n' +
        '                "removed": 0,\n' +
        '                "edited": [\n' +
        '                  {\n' +
        '                    "columnName": "$Association_Tab_Column_Name3",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  }\n' +
        '                ]\n' +
        '              },\n' +
        '              "samples": {\n' +
        '                "added": 3,\n' +
        '                "removed": 1,\n' +
        '                "edited": [\n' +
        '                  {\n' +
        '                    "columnName": "$Sample_Tab_Column_Name1",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  },\n' +
        '                  {\n' +
        '                    "columnName": "$Sample_Tab_Column_Name2",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  }\n' +
        '                ]\n' +
        '              },\n' +
        '              "edited": [\n' +
        '                {\n' +
        '                  "columnName": "$Association_Tab_Column_Name3",\n' +
        '                  "previous": "...",\n' +
        '                  "new": "..."\n' +
        '                }\n' +
        '              ]\n' +
        '            }\n' +
        '          ]\n' +
        '        }\n' +
        '      ]\n' +
        '    },\n' +
        '    {\n' +
        '      "fileId": "ae12bc-eee33-eaf32...",\n' +
        '      "fileName": "Stein_Submission.xlsx",\n' +
        '      "uploadDate": "2021-08-12T20:17:46.384Z",\n' +
        '      "studies": [\n' +
        '        {\n' +
        '          "total": 123,\n' +
        '          "added": [\n' +
        '            "study_tag1",\n' +
        '            "study_tag2",\n' +
        '            "..."\n' +
        '          ],\n' +
        '          "removed": [\n' +
        '            "study_tag1",\n' +
        '            "study_tag2",\n' +
        '            "..."\n' +
        '          ],\n' +
        '          "tags": [\n' +
        '            {\n' +
        '              "tag": "study_tag1",\n' +
        '              "associations": {\n' +
        '                "added": 4,\n' +
        '                "removed": 2,\n' +
        '                "edited": [\n' +
        '                  {\n' +
        '                    "columnName": "$Association_Tab_Column_Name1",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  },\n' +
        '                  {\n' +
        '                    "columnName": "$Association_Tab_Column_Name2",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  }\n' +
        '                ]\n' +
        '              },\n' +
        '              "samples": {\n' +
        '                "added": 3,\n' +
        '                "removed": 1,\n' +
        '                "edited": [\n' +
        '                  {\n' +
        '                    "columnName": "$Sample_Tab_Column_Name1",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  }\n' +
        '                ]\n' +
        '              },\n' +
        '              "edited": [\n' +
        '                {\n' +
        '                  "columnName": "$Study_Tab_Column_Name1",\n' +
        '                  "previous": "...",\n' +
        '                  "new": "..."\n' +
        '                },\n' +
        '                {\n' +
        '                  "columnName": "$Study_Tab_Column_Name2",\n' +
        '                  "previous": "...",\n' +
        '                  "new": "..."\n' +
        '                }\n' +
        '              ]\n' +
        '            },\n' +
        '            {\n' +
        '              "tag": "study_tag2",\n' +
        '              "associations": {\n' +
        '                "added": 0,\n' +
        '                "removed": 0,\n' +
        '                "edited": [\n' +
        '                  {\n' +
        '                    "columnName": "$Association_Tab_Column_Name3",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  }\n' +
        '                ]\n' +
        '              },\n' +
        '              "samples": {\n' +
        '                "added": 3,\n' +
        '                "removed": 1,\n' +
        '                "edited": [\n' +
        '                  {\n' +
        '                    "columnName": "$Sample_Tab_Column_Name1",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  },\n' +
        '                  {\n' +
        '                    "columnName": "$Sample_Tab_Column_Name2",\n' +
        '                    "previous": "...",\n' +
        '                    "new": "..."\n' +
        '                  }\n' +
        '                ]\n' +
        '              }\n' +
        '            }\n' +
        '          ]\n' +
        '        }\n' +
        '      ]\n' +
        '    }\n' +
        '  ]');
    }
    this.historySummaryReports = this.submissionService.generateSubmissionHistorySummaryReports(this.dataSource);*/
    this.loadHistory();
  }

  openDialog() {
    this.dialog.open(VersioningComponent, {width: '100%', height: '75%'});
  }

  downloadTemplate(fileId: string, fileName: string) {
    this.submissionService.downloadTemplate(this.submissionId, fileId).subscribe(
      (response: any) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([response]));
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      }
    );
  }

  loadHistory() {
    this.isLoading = true;
    this.submissionService.getVersionHistory(this.submissionId).subscribe(value => {
      this.isLoading = false;
      if (Array.isArray(value)) {
        const lastItem = value[value.length - 1];
        const tempHistory: SubmissionHistory = {
          currentVersionSummary: {
            totalStudies: lastItem.currentVersionSummary.totalStudies - lastItem.versionSummaryStats.studiesAdded
              + lastItem.versionSummaryStats.studiesRemoved,
            totalAcscns: lastItem.currentVersionSummary.totalAcscns - lastItem.versionSummaryStats.ascnsAdded
              + lastItem.versionSummaryStats.ascnsRemoved,
            totalSamples: lastItem.currentVersionSummary.totalSamples - lastItem.versionSummaryStats.samplesAdded
              + lastItem.versionSummaryStats.samplesRemoved,
          },
          versionSummaryStats: null, versionDiffStats: null, oldFileDetails: null,
          newFileDetails: {fileId: lastItem.oldFileDetails.fileId, fileName: lastItem.oldFileDetails.fileName}
        };
        value.push(tempHistory);
        this.dataSource = value;
        this.historySummaryReports = this.submissionService.generateSubmissionHistorySummaryReports(this.dataSource);
      }
      else {
        this.responseText = value;
      }
    });
  }
}
