import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubmissionListApiResponse } from '../api-responses/submissionListApiResponse';
import { Submission } from '../models/submission';

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

  downloadTemplate(submissionId: string, fileId: string) {
    return this.http.download('/submissions/' + submissionId + '/uploads/' + fileId + '/download');
  }
}
