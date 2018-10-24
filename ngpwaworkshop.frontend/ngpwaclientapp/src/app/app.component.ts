import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';

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

  constructor(private dataService: DataService) { }

  ngOnInit() {

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
