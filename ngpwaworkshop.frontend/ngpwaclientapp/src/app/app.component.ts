import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { PushInfoModel } from './models/PushInfoModel';

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
  private readonly VAPID_PUBLIC_KEY = 'BFVQxQ0d8PIczVLjSBFWxIZc0UMNnYHK7fC3tUmja2VwlLOAAKQl_pBtuv6_bfJpOAqMdC8_Pdm43Sf7SOIWYFU';

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

    this.swPush.requestSubscription({ serverPublicKey: this.VAPID_PUBLIC_KEY }).then(r => {

      const pushInfo = this.getPushInfo(r);
      this.dataService.registerPushInfo(pushInfo).subscribe(_ => {
        console.log('successfully registered push info');
      }, e => console.log(e));


    }).catch(e => {

      console.error('Push registration failed.');
      console.error(e);
    });

    this.swPush.messages.subscribe((m: any) => {
      if (m.notification && m.notification.body) {
        this.snackbar.open(m.notification.body, 'OK');
      }
    });



    this.load();
  }

  getPushInfo(sub: PushSubscription): PushInfoModel {

    const subJSObject = JSON.parse(JSON.stringify(sub));

    const pushInfo: PushInfoModel = {
      subscriptionEndpoint: sub.endpoint,
      auth: subJSObject.keys.auth,
      p256dh: subJSObject.keys.p256dh
    };

    console.log('got push info');
    console.log(pushInfo);
    return pushInfo;
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
