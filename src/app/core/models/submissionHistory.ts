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
