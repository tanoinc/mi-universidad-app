import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import { GenericDynamicListPage } from "../generic-dynamic-list/generic-dynamic-list";


@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsPage extends GenericDynamicListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.full_screen = false;
    this.list_searching = true;
  }

  ionViewDidLeave() {
    this.events.publish('notification:read');
  }

  protected getUpdatePromise(): Promise<any> {
    this.events.publish('notification:read');
    return this.ws.userNotifications()
  }

  protected getLoadMorePromise(): Promise<any> {
    return this.ws.userNotifications(this.page);
  }

  type(notification: any) {
    if (notification.notifiable_type == "App\\CalendarEvent") {
      return 'calendar';
    } else if (notification.notifiable_type == "App\\Newsfeed") {
      return 'newsfeed';
    }
    return null;
  }
  is(type: string, notification: any) {
    return (this.type(notification) == type);
  }

  icon(notification: any) {
    if (this.is('calendar', notification)) {
      return 'calendar';
    } else if (this.is('newsfeed', notification)) {
      return 'information-circle';
    }
  }

  title(notification: any) {
    if (this.is('calendar', notification)) {
      return notification.notifiable.event_name + " el día " + notification.notifiable.event_date;
    } else if (this.is('newsfeed', notification)) {
      return notification.notifiable.title;
    }
  }
}