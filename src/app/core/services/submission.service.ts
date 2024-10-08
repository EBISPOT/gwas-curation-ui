import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubmissionListApiResponse } from '../models/rest/api-responses/submissionListApiResponse';
import { Submission } from '../models/submission';
import { SubmissionHistory } from '../models/submissionHistory';
import { CurationHttpService } from './curation-http.service';
import { ReportedTrait } from '../models/reportedTrait';
import { Study } from '../models/study';
import { EfoTrait } from '../models/efoTrait';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(private http: HttpService, private curationHttp: CurationHttpService) { }

  getSubmissions(size: number, page: number, sort: string, order: string,
                 filter: string, filtersString: string): Observable<SubmissionListApiResponse> {
    if (filtersString) {
      const p = filtersString + '&size=' + String(size) + '&sort=' + sort + ',' + order + '&page=' + String(page);
      return this.curationHttp.get('/submissions?' + p);
    }
    let params: HttpParams = new HttpParams();
    params = params
      .set('size', String(size))
      .set('page', String(page))
      .set('sort', sort + ',' + order);
    if (filter) {
      if (filter.match(/^\d+$/)) {
        params = params.set('pmid', filter);
      }
      else if (filter.startsWith('GCP')) {
        params = params.set('bowId', filter);
      }
    }
    return this.curationHttp.get('/submissions', params);
  }

  getSubmission(id: string): Observable<Submission> {
    return this.curationHttp.get('/submissions/' + id);
  }

  downloadTemplate(submissionId: string, fileId: string) {
    return this.http.download('/submissions/' + submissionId + '/uploads/' + fileId + '/download');
  }

  lockOrUnlock(submissionId: string, lock: boolean) {
    let params: HttpParams = new HttpParams();
    params = params.set('lockStatus', lock ? 'lock' : 'unlock');
    return this.curationHttp.put('/submissions/' + submissionId + '/lock', null, params);
  }

  getVersionHistory(submissionId: string) {
    return this.curationHttp.get('/submissions/' + submissionId + '/versions');
  }

  generateSubmissionHistorySummaryReports(history: SubmissionHistory[]): string[] {
    const res: string[] = [];
    for (let i = 0; i < history.length - 1; i++) {
      const h = history[i];
      let s = '';
      if (h.versionSummaryStats.studiesAdded) {
        s += h.versionSummaryStats.studiesAdded + ' Studies added: [' + h.versionDiffStats.studyTagsAdded + '], ';
      }
      if (h.versionSummaryStats.studiesRemoved) {
        s += h.versionSummaryStats.studiesRemoved + ' Studies removed: [' + h.versionDiffStats.studyTagsRemoved + '], ';
      }
      if (h.versionSummaryStats.ascnsAdded) {
        s += h.versionSummaryStats.ascnsAdded + ' Associations added, ';
      }
      if (h.versionSummaryStats.ascnsRemoved) {
        s += h.versionSummaryStats.ascnsRemoved + ' Associations removed, ';
      }
      if (h.versionSummaryStats.samplesAdded) {
        s += h.versionSummaryStats.samplesAdded + ' Samples added, ';
      }
      if (h.versionSummaryStats.samplesRemoved) {
        s += h.versionSummaryStats.samplesRemoved + ' Samples removed, ';
      }
      if (h.versionSummaryStats.efoTraitsAdded) {
        s += h.versionSummaryStats.efoTraitsAdded + ' Efo Traits added, ';
      }
      if (h.versionSummaryStats.efoTraitsRemoved) {
        s += h.versionSummaryStats.efoTraitsRemoved + ' Efo Traits removed, ';
      }
      if (h.versionSummaryStats.reportedTraitsAdded) {
        s += h.versionSummaryStats.reportedTraitsAdded + ' Reported Traits added, ';
      }
      if (h.versionSummaryStats.reportedTraitsRemoved) {
        s += h.versionSummaryStats.reportedTraitsRemoved + ' Reported Traits removed, ';
      }
      s = s.slice(0, -2);
      if (s.length === 0) {
        s += 'No changes';
      }
      s += '.';
      res.push(s);
    }
    return res;
  }

  getSubmissionStudies(size: number, page: number, sort: string, order: string, submissionId: string, accession: string) {
    let params: HttpParams = new HttpParams();
    if (accession) {
      params = params.set('accession', String(accession));
    }
    params = params
      .set('size', String(size))
      .set('page', String(page))
      .set('sort', sort + ',' + order);
    return this.curationHttp.get('/submissions/' + submissionId + '/studies', params);
  }

  getStudy(submissionId: string, studyId: string) {

    return this.curationHttp.get('/submissions/' + submissionId + '/studies/' + studyId);
  }

  downloadBulkStudyMultiTraitUploadTemplate() {

    return this.curationHttp.download('/reported-traits/templates?file=study-multi-trait');
  }

  downloadBulkStudyTraitUploadTemplate() {

    return this.curationHttp.download('/reported-traits/templates?file=study-trait');
  }

  downloadBulkStudyEfoUploadTemplate() {

    return this.curationHttp.download('/reported-traits/templates?file=study-efo-trait');
  }

  downloadSamplesPrefilledTemplate(submissionId: string) {

    return this.curationHttp.download('/submissions/' + submissionId + '/studies/sampledescription/files');
  }

  editReportedTraits(trait: ReportedTrait, submissionId, study: Study) {

    return this.curationHttp.put('/submissions/' + submissionId + '/studies/' + study.studyId,
      {diseaseTrait: trait, study_tag: study.study_tag});
  }

  editEfoTraits(efoTraits: EfoTrait[], submissionId, study: Study) {

    return this.curationHttp.put('/submissions/' + submissionId + '/studies/' + study.studyId,
      {efoTraits, study_tag: study.study_tag});
  }

  editBgEfoTraits(backgroundEfoTraits: EfoTrait[], submissionId, study: Study) {

    return this.curationHttp.put('/submissions/' + submissionId + '/studies/' + study.studyId,
      {backgroundEfoTraits, study_tag: study.study_tag});
  }

  filterSubmissions(filtersString: string, size: number, page: number, sort: string, order: string) {
    const params = filtersString + '&size=' + String(size) + '&sort=' + sort + ',' + order;
    return this.curationHttp.get('/submissions?' + params);
  }

  patchSubmission(submission: Submission) {

    return this.curationHttp.patch('/submissions/' + submission.submissionId, submission);
  }

  getSubmissionSamples(size: number, page: number, sort: string, order: string, submissionId: string) {

    let params: HttpParams = new HttpParams();
    params = params
      .set('size', String(size))
      .set('page', String(page))
      .set('sort', sort + ',' + order);
    return this.curationHttp.get('/submissions/' + submissionId + '/studies/sampledescription', params);
  }

  getSnpStatus(submissionId: string) {
    return this.curationHttp.get('/submissions/' + submissionId + '/associations/snp-status');
  }

  approveSnps(submissionId: string) {
    return this.curationHttp.put('/submissions/' + submissionId + '/associations/approve-snps');
  }

  downloadSnpValidationReport(submissionId: string) {
    return this.curationHttp.download('/submissions/' + submissionId + '/associations/snp-validation-report');
  }

  retriggerSnpValidation(submissionId: string) {
    return this.http.get('/submissions/' + submissionId + '/validate-snps');
  }
}
