import { ApiResponse } from './apiResponse';
import { Curator } from '../../curator';

export interface CuratorListApiResponse extends ApiResponse {
  _embedded: {
    curatorDToes: Curator[];
  };
}
