import { Component } from '@angular/core';

import { NavController, Events } from 'ionic-angular';

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsPage {

  constructor(public navCtrl: NavController, public events: Events) {

  }

  ionViewDidLeave() {
    this.events.publish('notification:read');
  }

}
