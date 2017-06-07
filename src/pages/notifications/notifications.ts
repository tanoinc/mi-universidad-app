import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import { GenericDynamicListPage } from "../generic-dynamic-list/generic-dynamic-list";


@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsPage  extends GenericDynamicListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.full_screen = false;
    this.list_searching = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

  ionViewDidLeave() {
    this.events.publish('notification:read');
  }

  protected getUpdatePromise(): Promise<any> {
    return this.ws.userNotifications()
  }

  protected getLoadMorePromise(): Promise<any> {
    return this.ws.userNotifications(this.page);
  }
}