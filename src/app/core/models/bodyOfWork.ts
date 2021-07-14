import { Author } from './author';

export interface BodyOfWork {
  bodyOfWorkId: string;
  title: string;
  description: string;
  firstAuthor: Author;
  lastAuthor: Author;
  journal: string;
  doi: string;
  url: string;
  correspondingAuthors: Author[];
  prePrintServer: string;
  preprintServerDOI: string;
  embargoDate: Date;
  embargoUntilPublished: boolean;
  pmids: string[];
  status: string;
}
