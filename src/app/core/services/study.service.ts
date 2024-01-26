import { Injectable } from '@angular/core';
import { CurationHttpService } from './curation-http.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  constructor(private http: CurationHttpService) {}

  search(size: number, page: number, sort: string, order: string, efoTrait: string, reportedTrait: string, note: string, gcst: string,
         sumstatsFlag: string, pooledFlag: string, gxeFlag: string) {
    let params: HttpParams = new HttpParams();
    if (size) {
      params = params.set('size', String(size));
    }
    if (page) {
      params = params.set('page', String(page));
    }
    if (sort) {
      params = params.set('sort', sort + ',' + order);
    }
    if (efoTrait){
      params = params.set('efoTrait', efoTrait);
    }
    if (reportedTrait) {
      params = params.set('reportedTrait', reportedTrait);
    }
    if (note) {
      params = params.set('note', note);
    }
    if (gcst) {
      params = params.set('accessionId', gcst);
    }
    if (sumstatsFlag !== 'any' && sumstatsFlag != null) {
      params = params.set('sumstatsFlag', String(sumstatsFlag));
    }
    if (gxeFlag !== 'any' && gxeFlag != null) {
      params = params.set('gxeFlag', String(gxeFlag));
    }
    if (pooledFlag !== 'any' && pooledFlag != null) {
      params = params.set('pooledFlag', String(pooledFlag));
    }

    return this.http.get('/studies', params);
  }
}
