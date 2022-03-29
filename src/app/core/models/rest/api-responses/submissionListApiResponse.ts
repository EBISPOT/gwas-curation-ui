import { ApiResponse } from './apiResponse';
import { Submission } from '../../submission';

export interface SubmissionListApiResponse extends ApiResponse {
  _embedded: {
    submissions: Submission[];
  };
}
