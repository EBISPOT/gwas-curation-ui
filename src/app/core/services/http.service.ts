import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  private static formatErrors(error: any) {
    return throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.API_URL}${path}`, {params})
      .pipe(catchError(HttpService.formatErrors));
  }

  put(path: string, body: any = {}, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.put(
      `${environment.API_URL}${path}`,
      JSON.stringify(body),
      {params}
    ).pipe(catchError(HttpService.formatErrors));
  }

  post(path: string, body: any = {}): Observable<any> {
    return this.http.post(
      `${environment.API_URL}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(HttpService.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.API_URL}${path}`
    ).pipe(catchError(HttpService.formatErrors));
  }

  download(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.API_URL}${path}`, {params, responseType: 'blob'})
      .pipe(catchError(HttpService.formatErrors));
  }
}
