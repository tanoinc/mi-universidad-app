import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {

  public quantity: number = 0;

  constructor(public http: HttpClient, public events: Events) {

    this.events.subscribe('notification:push', (msg) => {
      console.log('notification:push -> NotificationProvider.');
      this.newNotification();
    });

    this.events.subscribe('notification:read', (msg) => {
      console.log('notification:read -> NotificationProvider.');
      this.markAsRead();
    });
  }

  /**
   * markAsRead
   */
  public markAsRead() {
    this.quantity = 0;
  }

  /**
   * newNotification
   */
  public newNotification() {
    this.quantity += 1;
  }

  /**
   * hasNotifications
   */
  public hasNotifications(): boolean {
    return (this.quantity > 0);
  }

}
