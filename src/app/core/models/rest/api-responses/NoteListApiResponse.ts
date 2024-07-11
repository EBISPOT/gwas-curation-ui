import { ApiResponse } from './apiResponse';
import { Note } from '../../note';

export interface NoteListApiResponse extends ApiResponse{
  _embedded: {
    publicationNotesDtoes: Note[]
  };
}
