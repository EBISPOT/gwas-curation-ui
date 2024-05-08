import { Provenance } from './provenance';

export interface Note {
  noteId: string;
  publicationId?: string;
  notes: string;
  created?: Provenance;
  updated?: Provenance;
}
