import { Provenance } from "./provenance";

export interface PublicationEvent {
    publicationId: string;
    event: string;
    eventDetails: string;
    created: Provenance;
}
