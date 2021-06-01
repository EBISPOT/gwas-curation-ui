import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurationHttpService {

  constructor(private http: HttpClient) {
  }

  private static formatErrors(error: any) {
    return throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.CURATION_API_URL}${path}`, {params})
      .pipe(catchError(CurationHttpService.formatErrors));
  }

  put(path: string, body: any = {}, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.put(
      `${environment.CURATION_API_URL}${path}`,
      JSON.stringify(body),
      {params}
    ).pipe(catchError(CurationHttpService.formatErrors));
  }

  post(path: string, body: any = {}): Observable<any> {
    return this.http.post(
      `${environment.CURATION_API_URL}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(CurationHttpService.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.CURATION_API_URL}${path}`
    ).pipe(catchError(CurationHttpService.formatErrors));
  }

  download(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.CURATION_API_URL}${path}`, {params, responseType: 'blob'})
      .pipe(catchError(CurationHttpService.formatErrors));
  }
}
