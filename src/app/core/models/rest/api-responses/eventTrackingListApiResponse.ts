import { PublicationEvent } from "../../publicationEvent";
import { ApiResponse } from "./apiResponse";

 export interface EventTrackingListApiResponse extends ApiResponse {
    
    _embedded: {
        publicationAuditEntryDtos: PublicationEvent[]
      };
}