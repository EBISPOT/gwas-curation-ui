import { SummaryStatsStatus } from './summaryStatsStatus';

export interface FileUpload {
  fileUploadId: string;
  fileName: string;
  fileSize: number;
  status: string;
  type: string;
  errors: string[];
  summaryStatsStatuses: SummaryStatsStatus[];
}
