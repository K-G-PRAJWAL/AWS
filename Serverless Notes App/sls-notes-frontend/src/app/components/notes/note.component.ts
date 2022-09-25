import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotesApiService } from '../../services/notes-api/notes-api.service';
import { NotesDataService } from '../../services/notes-data/notes-data.service';

@Component({
    selector: 'note',
    templateUrl: 'note.component.html'
})

export class NoteComponent implements OnInit {
    @Input() note;
    @Output() closeModalEvent = new EventEmitter();
    @Output() updateNoteEvent = new EventEmitter();
    @ViewChild("focus") vcInput;

    isLoading = false;
    alert;

    noteForm;
    defaultTitle;
    disableSubmit = false;

    constructor(private formBuilder: FormBuilder,
        private notesApiService: NotesApiService,
        private notesDataService: NotesDataService) {

    }

    ngOnInit() {
        this.alert = {};
        this.isLoading = true;
        this.defaultTitle = 'Title';
        this.noteForm = this.formBuilder.group({
            'title': [this.note.title ? this.note.title : ''],
            'content': [this.note.content ? this.note.content : '', Validators.required],
            'cat': [this.note.cat ? this.note.cat : 'general'],
            'timestamp': [this.note.timestamp],
            'note_id': [this.note.note_id]
        });
        this.isLoading = false;
    }

    ngAfterContentInit() {
        this.vcInput.nativeElement.focus();
    }

    onSubmit() {
        this.isLoading = true;
        this.disableSubmit = true;

        if (!this.noteForm.value.timestamp) {
            this.notesApiService.addNote(this.noteForm.value).subscribe(
                note => {
                    this.notesDataService.announceAddNote(note);
                },
                err => {
                    if (err.error && err.error.message) {
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

                    this.disableSubmit = false;
                    this.isLoading = false;
                },
                () => {
                    this.onCloseNoteModal();
                }
            );
        } else {
            this.notesApiService.updateNote(this.noteForm.value).subscribe(
                note => {
                    this.updateNoteEvent.emit(note);
                },
                err => {
                    if (err.error && err.error.message) {
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

                    this.disableSubmit = false;
                    this.isLoading = false;
                },
                () => {
                    this.onCloseNoteModal();
                }
            );
        }
    }

    onCloseNoteModal($event?) {
        if ($event) {
            $event.preventDefault();
        }
        this.closeModalEvent.emit();
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.keyCode == 27) { // 27 ==> Escape key 
            this.closeModalEvent.emit();
        }
    }
}