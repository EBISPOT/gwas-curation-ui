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
}
