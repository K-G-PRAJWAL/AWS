import { Component, OnInit } from '@angular/core';
import { NotesDataService } from '../../services/notes-data/notes-data.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {

    showNoteModal = false;
    newNote;
    constructor(private notesDataService: NotesDataService
    ) {  }

    ngOnInit() { 
        this.newNote = {};
        
    }

    onShowNoteModal($event) {
        this.showNoteModal = true;
    }

    onCloseNoteModal($event) {
        this.showNoteModal = false;
    }

    onSignOut() {
    }

}