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
    return this.http.get('/curators');
  }

  getCurationStatuses() {
    return this.http.get('/curation-status');
  }

  updatePublicationCurationDetails(pmid: string, publicationCurationPatchDto: any) {
    return this.http.patch('/publications/' + pmid + '/curation', publicationCurationPatchDto);
  }
}
