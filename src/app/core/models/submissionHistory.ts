export interface SubmissionHistory {
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

/*
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
}

 */
