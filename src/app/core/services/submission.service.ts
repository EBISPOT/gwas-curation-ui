import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubmissionListApiResponse } from '../api-responses/submissionListApiResponse';
import { Submission } from '../models/submission';
import { SubmissionHistory } from '../models/submissionHistory';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(private http: HttpService) { }

  getSubmissions(size: number, page: number, sort: string, order: string): Observable<SubmissionListApiResponse> {
    let params: HttpParams = new HttpParams();
    params = params.set('size', String(size)).set('page', String(page)).set('sort', sort + ',' + order);
    return this.http.get('/submissions', params);
  }

  getSubmission(id: string): Observable<Submission> {
    return this.http.get('/submissions/' + id);
  }

  getSubmissionHistory(id: string): Observable<SubmissionHistory[]> {
    return this.http.get('/submission-history/' + id);
  }

  downloadTemplate(submissionId: string, fileId: string) {
    return this.http.download('/submissions/' + submissionId + '/uploads/' + fileId + '/download');
  }

  lockOrUnlock(submissionId, lock: boolean) {
    let params: HttpParams = new HttpParams();
    params = params.set('lockStatus', lock ? 'lock' : 'unlock');
    return this.http.put('/submissions/' + submissionId + '/lock', null, params);
  }

  generateSubmissionHistorySummaryReports(history: SubmissionHistory[]): string[] {
    const res: string[] = [];
    for (const h of history) {
      let s = '';
      for (const study of h.studies) {
        s = study.added.length + ' studies added: [' + study.added + '], '
          + study.removed.length + ' removed: [' + study.removed + '], '
          + study.tags.filter(value => value.edited !== undefined).length + ' edited: ['
          + study.tags
            .filter(value => value.edited !== undefined)
            .map(value => value.tag) + ']';
      }
      res.push(s);
    }
    return res;
  }
}
