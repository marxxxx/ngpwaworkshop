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
    this.dataService.sendMessage(this.name, this.message).subscribe(r => {
      this.load();
    });
  }
}
