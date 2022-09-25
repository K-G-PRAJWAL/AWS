import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as _ from "lodash";
import { NotesApiService } from '../../services/notes-api/notes-api.service';
import { NotesDataService } from '../../services/notes-data/notes-data.service';

@Component({
    selector: 'notes',
    templateUrl: 'notes.component.html'
})

export class NotesComponent implements OnInit {
    @Output() showNoteModalEvent = new EventEmitter();
    
    userNotes;
    isLoading;
    isListLoading;
    selectedNote;
    showNote = false;
    startKey;
    alert;
    NotesDataSubscription;
    AddNoteSubscription;
    noNotesFound;

    constructor(private notesApiService: NotesApiService,
                private notesDataService: NotesDataService) { }

    ngOnInit() { 
        this.isListLoading = false;
        this.noNotesFound = false;
        this.showNote = false;
        this.alert = {};
        
        this.refreshNotes();
        this.AddNoteSubscription = this.notesDataService.addNote$.subscribe(
            (note)=>{
                this.addNote(note);
            }
        );
    }

    refreshNotes() {
        this.isLoading = true;
        this.userNotes = [];
        this.notesApiService.getNotes().subscribe(
            res => {
                let data = res;
                if(_.has(res, 'LastEvaluatedKey')) {
                    this.startKey = res.LastEvaluatedKey.timestamp;
                } else {
                    this.startKey = 0;
                }

                if(_.has(res, 'Items')) {
                    this.userNotes = _.union(this.userNotes, res.Items);
                    if(this.userNotes.length == 0) {
                        this.noNotesFound = true;
                    } else {
                        this.noNotesFound = false;
                    }
                }
            }, err => {
                if(err.error && err.error.message) {
                    this.alert = {
                        type: 'danger',
                        message: err.error.message
                    }
                } else {
                    this.alert = {
                        type: 'danger',
                        message: err.message
                    }
                }
                this.isLoading = false;
            }, () => {
                this.isLoading = false;
            }
        );
    }

    onShowNoteModal($event) {
        $event.preventDefault();
        this.showNoteModalEvent.emit();
    }

    openNote(note) {
        this.selectedNote = note;
        this.showNote = true;
    }

    onCloseNoteModal() {
        this.showNote = false;
    }

    deleteNote(note) {
        // this.refreshNotes();
        let index = _.findIndex(this.userNotes, (item) => { return item.timestamp == note.timestamp; });
        this.userNotes.splice(index, 1);
        if(this.userNotes.length < 5) {
            this.onScrollDown();
        }

        if(this.userNotes.length == 0) {
            this.refreshNotes();
        }
    }

    updateNote(note) {
        let index = _.findIndex(this.userNotes, (item) => { return item.timestamp == note.timestamp; });
        this.userNotes.splice(index, 1, note);
    }

    addNote(note) {
        // console.log("Adding note", note);
        this.userNotes.splice(0, 0, note);
        this.noNotesFound = false;
    }

    onScrollDown() {
        if(this.startKey == 0) {
            return;
        }

        this.isListLoading = true;
        this.NotesDataSubscription = this.notesApiService.getNotes(this.startKey).subscribe(
            res => {
                let data = res;
                if(_.has(res, 'LastEvaluatedKey')) {
                    this.startKey = res.LastEvaluatedKey.timestamp;
                } else {
                    this.startKey = 0;
                }

                if(_.has(res, 'Items')) {
                    this.userNotes = _.union(this.userNotes, res.Items);
                    if(this.userNotes.length == 0) {
                        this.noNotesFound = true;
                    } else {
                        this.noNotesFound = false;
                    }
                }
            }, err => {
                if(err.error && err.error.message) {
                    this.alert = {
                        type: 'danger',
                        message: err.error.message
                    }
                } else {
                    this.alert = {
                        type: 'danger',
                        message: err.message
                    }
                }
                this.isListLoading = false;
            }, () => {
                this.isListLoading = false;
            }
        );
    }

}