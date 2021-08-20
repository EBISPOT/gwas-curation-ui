import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubmissionListApiResponse } from '../models/rest/api-responses/submissionListApiResponse';
import { Submission } from '../models/submission';
import { SubmissionHistory } from '../models/submissionHistory';
import { CurationHttpService } from './curation-http.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(private http: HttpService, private curationHttp: CurationHttpService) { }

  getSubmissions(size: number, page: number, sort: string, order: string, filter: string): Observable<SubmissionListApiResponse> {
    let params: HttpParams = new HttpParams();
    params = params
      .set('size', String(size))
      .set('page', String(page))
      .set('sort', sort + ',' + order);
    if (filter) {
      if (filter.match(/^\d+$/)) {
        params = params.set('pmid', filter);
      }
      else if (filter.startsWith('GCP')) {
        params = params.set('bowId', filter);
      }
    }
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
      if (h.versionSummaryStats.efoTraitsAdded) {
        s += h.versionSummaryStats.efoTraitsAdded + ' Efo Traits added, ';
      }
      if (h.versionSummaryStats.efoTraitsRemoved) {
        s += h.versionSummaryStats.efoTraitsRemoved + ' Efo Traits removed, ';
      }
      if (h.versionSummaryStats.reportedTraitsAdded) {
        s += h.versionSummaryStats.reportedTraitsAdded + ' Reported Traits added, ';
      }
      if (h.versionSummaryStats.reportedTraitsRemoved) {
        s += h.versionSummaryStats.reportedTraitsRemoved + ' Reported Traits removed, ';
      }
      s = s.slice(0, -2);
      if (s.length === 0) {
        s += 'No changes';
      }
      s += '.';
      res.push(s);
    }
    return res;
  }
}
