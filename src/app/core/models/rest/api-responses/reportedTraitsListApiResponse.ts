import { ApiResponse } from './apiResponse';
import { ReportedTrait } from '../../reportedTrait';

export interface ReportedTraitsListApiResponse extends ApiResponse {
  _embedded: {
    diseaseTraits: ReportedTrait[];
  };
}
