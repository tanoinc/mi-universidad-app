import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController, Events } from 'ionic-angular';
import { GenericPage } from '../generic/generic';
import { Webservice } from '../../providers/webservice/webservice';

/**
 * Generated class for the NotificationDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-notification-detail',
  templateUrl: 'notification-detail.html',
})
export class NotificationDetailPage extends GenericPage {
  protected notification: any;
  protected type: string;

  protected title: string;
  protected content;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.initNotification();
    this.initTitle(this.notification);
  }

  close() {
    this.viewCtrl.dismiss();
  }

  protected initNotification() {
    this.notification = this.navParams.get('notification');
    this.type = this.navParams.get('type');
  }

  protected initTitle(detail: any) {
    if (this.type=="calendar") {
      this.title = detail.event_name;
    } else if (this.type=="attendance") {
      this.title = detail.name;
    } else if (this.type=="newsfeed") {
      this.title = detail.title;
    }
  }
}
