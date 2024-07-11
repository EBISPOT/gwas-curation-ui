import { Curator } from './curator';
import { CurationStatus } from './curationStatus';

export interface Publication {
   publicationId: string;
   pmid: string;
   journal: string;
   title: string;
   firstAuthor: string;
   publicationDate: Date;
   correspondingAuthor: {
     authorName: string;
     email: string;
   };
   status: string;
   curationStatus: CurationStatus;
   curator: Curator;
   bodyOfWorkId: string;
   submissionIds: string[];
   isUserRequested: boolean;
   isOpenTargets: boolean;
}
