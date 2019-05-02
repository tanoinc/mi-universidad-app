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
  protected notification;
  protected type;

  protected title;
  protected content;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.notification = navParams.get('notification');
    this.type = navParams.get('type');

    if (this.type=="calendar") {
      this.title= this.notification.event_name;
    } else if (this.type=="newsfeed") {
      this.title= this.notification.title;
    }
  }

  ionViewDidLoad() {

  }

  close() {
    this.viewCtrl.dismiss();
  }
}
