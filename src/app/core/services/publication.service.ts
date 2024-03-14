import { Injectable } from '@angular/core';
import { CurationHttpService } from './curation-http.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { PublicationListApiResponse } from '../models/rest/api-responses/publicationListApiResponse';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  constructor(private http: CurationHttpService) { }

  getPublications(size: number, page: number, sort: string, order: string, pmid: string, title: string, curator: string,
                  curationStatus: string, submitter: string): Observable<PublicationListApiResponse> {
    let params: HttpParams = new HttpParams();
    params = params
      .set('size', String(size))
      .set('page', String(page));
    if (sort) {
      params = params.set('sort', sort + ',' + order);
    }
    if (pmid) {
      params = params.set('pmid', pmid);
    }
    if (title) {
      params = params.set('title', title);
    }
    if (curator) {
      params = params.set('curator', curator);
    }
    if (curationStatus) {
      params = params.set('curationStatus', curationStatus);
    }
    if (submitter) {
      params = params.set('submitter', submitter);
    }
    return this.http.get('/publications', params);
  }

  getCurators() {
    let params: HttpParams = new HttpParams();
    params = params
      .set('size', String(50))
      .set('page', String(0));
    return this.http.get('/curators', params);
  }

  getCurationStatuses() {
    let params: HttpParams = new HttpParams();
    params = params
      .set('size', String(50))
      .set('page', String(0));
    return this.http.get('/curation-status', params);
  }

  updatePublicationCurationDetails(pmid: string, publicationCurationPatchDto: any) {
    return this.http.patch('/publications/' + pmid + '/curation', publicationCurationPatchDto);
  }

  importPublicationsFromEpmc(pmids: string[]) {
    return this.http.post('/publications/' + pmids.join(','));
  }

  getSubmissionMatchingReport(pmid: string) {
    let params: HttpParams = new HttpParams();
    params = params
      .set('size', String(50))
      .set('page', String(1));
    return this.http.get('/publications/' + pmid + '/linked-submissions', params);
  }

  linkSubmission(pmid: string, submissionId: string) {
    return this.http.put('/publications/' + pmid + '/link-submission', new HttpParams().set('submissionId', submissionId));
  }
}
