import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EfoTraitsListApiResponse } from '../models/rest/api-responses/efoTraitsListApiResponse';
import { CurationHttpService } from './curation-http.service';
import { EfoTrait } from '../models/efoTrait';

@Injectable({
  providedIn: 'root'
})
export class EfoTraitService {

  constructor(private http: CurationHttpService) { }

  getTraits(size: number, page: number, sort: string, order: string, trait: string): Observable<EfoTraitsListApiResponse> {
    let params: HttpParams = new HttpParams();
    params = params
      .set('size', String(size))
      .set('page', String(page))
      .set('sort', sort + ',' + order);
    if (trait && trait !== '') {
      params = params.set('trait', trait);
    }
    return this.http.get('/efo-traits', params);
  }

  createTrait(efoTrait: EfoTrait) {
    return this.http.post('/efo-traits', efoTrait);
  }

  downloadBulkEfoTraitUploadTemplate() {
    return this.http.download('/efo-traits/download-template');
  }

  deleteTrait(efoTraitId: string) {
    return this.http.delete('/efo-traits/' + efoTraitId);
  }

  editTrait(traitId: string, efoTrait: EfoTrait) {
    return this.http.put('/efo-traits/' + traitId, efoTrait);
  }
}
