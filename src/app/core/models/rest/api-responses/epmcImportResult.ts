import { Publication } from '../../publication';

export interface EpmcImportResult {
  publicationDto: Publication;
  pmid: string;
  status: string;
}
