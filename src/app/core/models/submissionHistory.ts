/*export interface SubmissionHistory {
  fileId: string;
  fileName: string;
  uploadDate: Date;
  studies: [
    {
      total: number;
      added: string[];
      removed: string[];
      tags: [
        {
          tag: string,
          edited: Edited[],
          associations: {
            added: number,
            removed: number,
            edited: Edited[]
          },
          samples: {
            added: number,
            removed: number,
            edited: Edited[]
          }
        }
      ]
    }
  ];
}

interface Edited {
  columnName: string;
  previous: string;
  new: string;
}

export interface SubmissionHistory {
  fileId: string;
  fileName: string;
  uploadDate: Date;
  version: [
    {
      studiesCount: number;
      studiesAdded: string[];
      studiesRemoved: string[];
      studies: [
        {
          tag: string,
          edited: Edited[],
          associations: EmbeddedStudyVersionFields,
          samples: EmbeddedStudyVersionFields,
          efoTraits: EmbeddedStudyVersionFields
        }
      ]
    }
  ];
}

interface EmbeddedStudyVersionFields {
  added: number;
  removed: number;
  edited: Edited[];
}

interface Edited {
  columnName: string;
  previous: string;
  new: string;
}*/

export interface SubmissionHistory {
  currentVersionSummary: {
    totalStudies: number;
    // TODO tell Sajo to change this
    totalAcscns: number;
    totalSamples: number;
  };
  versionSummaryStats: {
    studiesAdded: number;
    studiesRemoved: number;
    ascnsAdded: number;
    ascnsRemoved: number;
    samplesAdded: number;
    samplesRemoved: number;
    // TODO fill these in summary
    reportedTraitsAdded: number;
    reportedTraitsRemoved: number;
    efoTraitsAdded: number;
    efoTraitsRemoved: number;
  };
  versionDiffStats: {
    studyTagsAdded: string;
    studyTagsRemoved: string;
    studies: [
      {
        identifier: string;
        ascnsAdded: number;
        ascnsRemoved: number;
        samplesAdded: number;
        samplesRemoved: number;
        edited: Edited[];
        associations: [
          {
            identifier: string;
            edited: Edited[];
          }
        ],
        samples: [
          {
            identifier: string;
            edited: Edited[];
          }
        ]
      }
    ]
  };
  oldFileDetails: FileDetails;
  newFileDetails: FileDetails;
}

interface Edited {
  property: string;
  oldValue: string;
  newValue: string;
}

interface FileDetails {
  fileId: string;
  fileName: string;
}
