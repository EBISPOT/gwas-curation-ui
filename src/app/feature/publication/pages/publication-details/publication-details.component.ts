import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../../../core/services/publication.service';
import { ActivatedRoute } from '@angular/router';
import { Publication } from '../../../../core/models/publication';
import { Submission } from '../../../../core/models/submission';
import { BodyOfWork } from '../../../../core/models/bodyOfWork';
import { SubmissionService } from '../../../../core/services/submission.service';
import { CurationStatus } from '../../../../core/models/curationStatus';
import { Curator } from '../../../../core/models/curator';
import {
  CurationStatusListApiResponse
} from '../../../../core/models/rest/api-responses/curationStatusListApiResponse';
import { CuratorListApiResponse } from '../../../../core/models/rest/api-responses/curatorListApiResponse';
import { environment } from '../../../../../environments/environment';
import { MatSelect } from '@angular/material/select';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Note } from '../../../../core/models/note';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-publication-details',
  templateUrl: './publication-details.component.html',
  styleUrls: ['./publication-details.component.css']
})
export class PublicationDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private publicationService: PublicationService,
              private submissionService: SubmissionService, private dialog: MatDialog, private snackBar: MatSnackBar) { }
  publication: Publication;
  bodyOfWork: BodyOfWork;
  submissions: {submission: Submission, isLoading: boolean}[] = [];
  publicationId: string;
  isLoadingPublication = true;
  isLoadingBoW = true;
  curationStatus: CurationStatus[];
  curators: Curator[];
  notes: Note[] = [];
  isLoadingNotes = true;
  curationDetailsChanged = false;
  editNote: Note;

  protected readonly env = environment;

  ngOnInit(): void {
    this.publicationId = this.route.snapshot.paramMap.get('publicationId');
    this.publicationService.getPublication(this.publicationId).subscribe(publication => {
      this.isLoadingPublication = false;
      publication.curator.fullName = (publication.curator.firstName ? publication.curator.firstName : '')
        + (publication.curator.lastName ? ' ' + publication.curator.lastName : '');
      this.publication = publication;
      if (this.publication.bodyOfWorkId) {
        this.publicationService.getBodyOfWork(this.publication.bodyOfWorkId).subscribe(bodyOfWork => {
          this.bodyOfWork = bodyOfWork;
          this.isLoadingBoW = false;
        });
      }
      if (this.publication.submissionIds) {
        for (const [index, submissionId] of this.publication.submissionIds.entries()) {
          this.submissions.push({submission: null, isLoading: true});
          this.submissionService.getSubmission(submissionId).subscribe(submission => {
            this.submissions[index] = {submission, isLoading: false};
          });
        }
      }
    });

    this.publicationService.getCurationStatuses(100, 0, null, null)
      .subscribe((status: CurationStatusListApiResponse) => this.curationStatus = status._embedded.curationStatusDToes);
    this.publicationService.getCurators(100, 0, 'firstName', 'asc')
      .subscribe((curators: CuratorListApiResponse) => {
        curators._embedded.curatorDToes
          .forEach(curator => curator.fullName = (curator.firstName ? curator.firstName : '') + (curator.lastName ? ' ' + curator.lastName : ''));
        this.curators = curators._embedded.curatorDToes;
      });

    this.publicationService.getNotes(this.publicationId).subscribe(value => {
      this.isLoadingNotes = false;
      this.notes = value._embedded?.publicationNotesDtoes;
    });
  }

  compareCurationStatus(o1: CurationStatus, o2: CurationStatus) {
    return o1?.curationStatusId === o2?.curationStatusId;
  }

  compareCurator(o1: Curator, o2: Curator) {
    return o1?.curatorId === o2?.curatorId;
  }

  openSaveCurationDetailsDialog(pmid: string, curator: Curator, curationStatus: CurationStatus, originalValue: any, select: MatSelect) {
    select.value = originalValue;
    let message = '';
    if (curator) {
      if (originalValue?.curatorId === curator?.curatorId) { return; }
      message = 'Set <b>Curator</b> for PMID ' + pmid + ': <b>' + curator.fullName + '</b>';
    }
    if (curationStatus) {
      if (originalValue?.curationStatusId === curationStatus?.curationStatusId) { return; }
      message = 'Set <b>Curation Status</b> for PMID ' + pmid + ': <b>' + curationStatus.status + '</b>';
    }

    const dialogData = new ConfirmationDialogModel('Confirm save', message);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '800px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.isLoadingPublication = true;
        this.publicationService.patchPublication(pmid, {curator, curationStatus}).subscribe((value) => {
          this.isLoadingPublication = false;
          value.curator.fullName = (value.curator.firstName ? value.curator.firstName : '')
            + (value.curator.lastName ? ' ' + value.curator.lastName : '');
          this.publication = value;
          this.curationDetailsChanged = true;
          this.snackBar.open('Save successful.', '', {duration: 2500});
        }, (error) => {
          this.isLoadingPublication = false;
          if (error.error.indexOf('linked') > 0) {
            this.snackBar.open(error.error, '', {duration: 2500});
          }
          else {
            this.snackBar.open('Error occurred on save.', '', {duration: 2500});
          }
        });
      }
    });
  }

  saveNote(note: string) {
    this.isLoadingNotes = true;
    this.publicationService.createNote(this.publicationId, note).subscribe(() => {
      this.snackBar.open('Comment saved.', '', {duration: 2500});
      this.publicationService.getNotes(this.publicationId).subscribe(value => {
        this.isLoadingNotes = false;
        this.notes = value._embedded.publicationNotesDtoes;
      });
    }, () => {
      this.isLoadingNotes = false;
      this.snackBar.open('Error occurred on save.', '', {duration: 2500});
    });
  }

  deleteNote(noteId: string) {
    this.isLoadingNotes = true;
    this.publicationService.deleteNote(this.publicationId, noteId).subscribe(() => {
      this.snackBar.open('Comment deleted.', '', {duration: 2500});
      this.publicationService.getNotes(this.publicationId).subscribe(value => {
        this.isLoadingNotes = false;
        this.notes = value._embedded?.publicationNotesDtoes;
      });
    }, () => {
      this.isLoadingNotes = false;
      this.snackBar.open('Error occurred on delete.', '', {duration: 2500});
    });
  }

  updateNote() {
    this.isLoadingNotes = true;
    this.publicationService.updateNote(this.publicationId, this.editNote.noteId, this.editNote.notes).subscribe(() => {
      this.snackBar.open('Note updated.', '', {duration: 2500});
      this.publicationService.getNotes(this.publicationId).subscribe(value => {
        this.isLoadingNotes = false;
        this.notes = value._embedded.publicationNotesDtoes;
        this.editNote = null;
      });
    }, () => {
      this.isLoadingNotes = false;
      this.snackBar.open('Error occurred on update.', '', {duration: 2500});
    });
  }

  openSaveFlagConfirmationDialog(field: string, cb: MatCheckbox) {
    const message = field + ': ' + cb.checked;

    const dialogData = new ConfirmationDialogModel('Confirm save', message);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const publication: Publication = ({} as any) as Publication;
        publication.publicationId = this.publicationId;
        let isUserRequested: boolean;
        let isOpenTargets: boolean;
        if (field === 'User Requested') { isUserRequested = cb.checked; }
        if (field === 'Open Targets') { isOpenTargets = cb.checked; }
        this.isLoadingPublication = true;
        this.publicationService.patchPublication(this.publication.pmid, {isUserRequested, isOpenTargets}).subscribe((publication) => {
          publication.curator.fullName = (publication.curator.firstName ? publication.curator.firstName : '')
            + (publication.curator.lastName ? ' ' + publication.curator.lastName : '');
          this.publication = publication;
          this.isLoadingPublication = false;
          this.snackBar.open('Changes saved.', '', {duration: 2500});
        }, () => {
          this.isLoadingPublication = false;
          if (field === 'User Requested') { cb.checked = this.publication.isUserRequested; }
          if (field === 'Open Targets') { cb.checked = this.publication.isOpenTargets; }
          this.snackBar.open('Error occurred while saving flags.', '', {duration: 2500});
        });
      }
      else {
        if (field === 'User Requested') { cb.checked = this.publication.isUserRequested; }
        if (field === 'Open Targets') { cb.checked = this.publication.isOpenTargets; }
      }
    });
  }
}
