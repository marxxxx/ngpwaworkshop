import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';

/**
 * App Component and the only page in this Single Page Application.
 * The most single page application possible.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////
  // members
  ////////////////////////////////////////////////////////////////////////
  name: string;
  message: string;
  isBusySending = false;
  messages: string[] = [];

  ////////////////////////////////////////////////////////////////////////
  // construction
  ////////////////////////////////////////////////////////////////////////
  constructor(private dataService: DataService,
    private swUpdate: SwUpdate, private swPush: SwPush,
    private snackbar: MatSnackBar) { }

  ////////////////////////////////////////////////////////////////////////
  // functions
  ////////////////////////////////////////////////////////////////////////
  ngOnInit() {
    this.swUpdate.available.subscribe(e => {
      this.snackbar.open('Update verfügbar.', 'OK')
        .onAction().subscribe(r => {
          location.reload(true);
        });
    });

    this.load();
  }

  load() {
    this.dataService.getMessages().subscribe(m => {
      this.messages = m;
    }, e => console.error(e));
  }

  onClick() {
    this.isBusySending = true;
    this.dataService.sendMessage(this.name, this.message).subscribe(r => {
      this.isBusySending = false;
      this.load();
    }, e => {
      this.isBusySending = false;
    });
  }
}
