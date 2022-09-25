import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable()
export class NotesDataService {

    private announceAddNoteSource = new Subject();
    addNote$ = this.announceAddNoteSource.asObservable();

    constructor() { }

    announceAddNote(note) {
        this.announceAddNoteSource.next(note);
    }
}