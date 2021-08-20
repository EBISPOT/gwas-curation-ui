import { Injectable } from '@angular/core';
import { CurationHttpService } from './curation-http.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ReportedTraitsListApiResponse } from '../models/rest/api-responses/reportedTraitsListApiResponse';

@Injectable({
  providedIn: 'root'
})
export class ReportedTraitService {

  constructor(private http: CurationHttpService) { }

  getTraits(size: number, page: number, sort: string, order: string, filter: string): Observable<ReportedTraitsListApiResponse> {
    let params: HttpParams = new HttpParams();
    params = params
      .set('size', String(size))
      .set('page', String(page))
      .set('sort', sort + ',' + order);
    if (filter && filter !== '') {
      params = params.set('filter', filter);
    }
    return this.http.get('/reported-traits', params);
  }

  createTrait(trait: string) {
    return this.http.post('/reported-traits', {trait});
  }

  deleteTrait(id: string) {
    return this.http.delete('/reported-traits/' + id);
  }
}
