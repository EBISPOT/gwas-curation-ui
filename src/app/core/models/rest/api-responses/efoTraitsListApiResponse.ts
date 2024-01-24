import { EfoTrait } from '../../efoTrait';
import { ApiResponse } from './apiResponse';

export interface EfoTraitsListApiResponse extends ApiResponse {
  _embedded: {
    efoTraits: EfoTrait[];
  };
}
