import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NotesDataService } from '../../services/notes-data/notes-data.service';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    @Output() showNoteModalEvent = new EventEmitter();
    @Output() signOutUserEvent = new EventEmitter();

    constructor(private notesDataService: NotesDataService) {
    }

    ngOnInit() { }

    onShowNoteModal($event) {
        $event.preventDefault();
        this.showNoteModalEvent.emit();
    }   

    onSignOut() {
        this.signOutUserEvent.emit();
    }
}