import { ApiResponse } from './apiResponse';
import { CurationStatus } from '../../curationStatus';

export interface CurationStatusListApiResponse extends ApiResponse {
  _embedded: {
    curationStatusDToes: CurationStatus[];
  };
}
