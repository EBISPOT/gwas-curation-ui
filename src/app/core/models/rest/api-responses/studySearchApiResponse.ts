import { ApiResponse } from './apiResponse';
import { StudySolr } from '../../studySolr';

export interface StudySearchApiResponse extends ApiResponse {

  _embedded: {
    studySolrDToes: StudySolr[];
  };
}
