import { ApiResponse } from './apiResponse';
import { Publication } from '../../publication';

export interface PublicationListApiResponse extends ApiResponse {
  _embedded: {
    solrPublicationDToes: Publication[]
  };
}
