import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events, ModalController } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import { GenericDynamicListPage } from "../generic-dynamic-list/generic-dynamic-list";
import { NotificationDetailPage } from "../notification-detail/notification-detail";
import { DatePipe } from "@angular/common";


@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsPage extends GenericDynamicListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events, protected modalCtrl: ModalController, protected datePipe: DatePipe) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.full_screen = false;
    this.list_searching = true;
  }

  ionViewDidLoad() {
    this.list_searching = true;
    super.ionViewDidLoad();
  }

  ionViewDidLeave() {
    this.events.publish('notification:read');
  }

  protected getUpdatePromise(force_load: boolean = false): Promise<any> {
    this.events.publish('notification:read');
    return this.ws.userNotifications(0, null, force_load);
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
    let context = "";
    if (notification.notifiable.context && notification.notifiable.context.description != "") {
      context = " (" + notification.notifiable.context.description + ")";
    }
    if (this.is('calendar', notification)) {
      return notification.notifiable.event_name + " el día " + this.datePipe.transform(notification.notifiable.event_date, 'short') + context;
    } else if (this.is('newsfeed', notification)) {
      return notification.notifiable.title + context;
    }
  }

  open(notification) {
    //this.navCtrl.parent.select(0);
    let profileModal = this.modalCtrl.create(NotificationDetailPage, { notification: notification.notifiable, type: this.type(notification) });
    profileModal.present();
  }

}