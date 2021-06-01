import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubmissionListApiResponse } from '../api-responses/submissionListApiResponse';
import { Submission } from '../models/submission';
import { SubmissionHistory } from '../models/submissionHistory';
import { CurationHttpService } from './curation-http.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(private http: HttpService, private curationHttp: CurationHttpService) { }

  getSubmissions(size: number, page: number, sort: string, order: string): Observable<SubmissionListApiResponse> {
    let params: HttpParams = new HttpParams();
    params = params.set('size', String(size)).set('page', String(page)).set('sort', sort + ',' + order);
    return this.http.get('/submissions', params);
  }

  getSubmission(id: string): Observable<Submission> {
    return this.http.get('/submissions/' + id);
  }

  downloadTemplate(submissionId: string, fileId: string) {
    return this.http.download('/submissions/' + submissionId + '/uploads/' + fileId + '/download');
  }

  lockOrUnlock(submissionId: string, lock: boolean) {
    let params: HttpParams = new HttpParams();
    params = params.set('lockStatus', lock ? 'lock' : 'unlock');
    return this.curationHttp.put('/submissions/' + submissionId + '/lock', null, params);
  }

  getVersionHistory(submissionId: string) {
    return this.curationHttp.get('/submissions/' + submissionId + '/versions');
  }

  generateSubmissionHistorySummaryReports(history: SubmissionHistory[]): string[] {
    const res: string[] = [];
    for (let i = 0; i < history.length - 1; i++) {
      const h = history[i];
      let s = '';
      if (h.versionSummaryStats.studiesAdded) {
        s += h.versionSummaryStats.studiesAdded + ' Studies added: [' + h.versionDiffStats.studyTagsAdded + '], ';
      }
      if (h.versionSummaryStats.studiesRemoved) {
        s += h.versionSummaryStats.studiesRemoved + ' Studies removed: [' + h.versionDiffStats.studyTagsRemoved + '], ';
      }
      if (h.versionSummaryStats.ascnsAdded) {
        s += h.versionSummaryStats.ascnsAdded + ' Associations added, ';
      }
      if (h.versionSummaryStats.ascnsRemoved) {
        s += h.versionSummaryStats.ascnsRemoved + ' Associations removed, ';
      }
      if (h.versionSummaryStats.samplesAdded) {
        s += h.versionSummaryStats.samplesAdded + ' Samples added, ';
      }
      if (h.versionSummaryStats.samplesRemoved) {
        s += h.versionSummaryStats.samplesRemoved + ' Samples removed, ';
      }
      s = s.slice(0, -2);
      s += '.';
      res.push(s);
    }
    return res;
  }
}
