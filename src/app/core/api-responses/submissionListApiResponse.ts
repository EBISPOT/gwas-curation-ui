import { ApiResponse } from '../models/apiResponse';
import { Submission } from '../models/submission';

export interface SubmissionListApiResponse extends ApiResponse {
  _embedded: {
    submissions: Submission[];
  };
}
