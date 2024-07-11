import { Injectable } from '@angular/core';
import { CurationHttpService } from './curation-http.service';
import { Observable } from 'rxjs';
import { EventTrackingListApiResponse } from '../models/rest/api-responses/eventTrackingListApiResponse';
import { HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class EventTrackingService {

  constructor(private http: CurationHttpService) { }

  getPublicationEvents(size: number, page: number, sort: string, order: string, publicationId : string): Observable<EventTrackingListApiResponse> {
    let params: HttpParams = new HttpParams();
    params = params
      .set('size', String(size))
      .set('page', String(page));
    
    if (sort) {
      params = params.set('sort', sort + ',' + order);
    }
    return this.http.get('/publications/' + publicationId +'/publication-audit-entries', params);
  }
  
}
