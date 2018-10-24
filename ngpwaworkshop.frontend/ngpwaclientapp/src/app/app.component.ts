import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  name: string;
  message: string;
  isBusySending = false;
  messages: string[] = [];

  constructor(private dataService: DataService,
    private swUpdate: SwUpdate, private swPush: SwPush,
    private snackbar: MatSnackBar) { }

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
    });
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
