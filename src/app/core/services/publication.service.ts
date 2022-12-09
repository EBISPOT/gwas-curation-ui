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

  getPublications(size: number, page: number, sort: string, order: string, pmid: string, title: string, curator: string): Observable<PublicationListApiResponse> {
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
    return this.http.get('/publications', params);
  }
}
