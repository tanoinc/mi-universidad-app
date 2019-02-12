import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

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
export class NotificationDetailPage {
  protected notification;
  protected type;

  protected title;
  protected content;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
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
