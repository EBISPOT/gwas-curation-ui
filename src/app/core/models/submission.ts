import { Publication } from './publication';
import { BodyOfWork } from './bodyOfWork';
import { FileUpload } from './fileUpload';
import { Provenance } from './provenance';

export interface Submission {

  submissionId: string;
  publication: Publication;
  bodyOfWork: BodyOfWork;
  submission_status: string;
  metadata_status: string;
  summary_statistics_status: string;
  files: FileUpload[];
  study_count: number;
  sample_count: number;
  association_count: number;
  globusFolder: string;
  globusOriginId: string;
  provenanceType: string;
  date_submitted: Date;
  created: Provenance;
  lastUpdated: Provenance;
  editTemplate: Provenance;
  lockDetails: {lockedBy: Provenance, status: string};
  agreedToCc0: boolean;
  type: string;
}
