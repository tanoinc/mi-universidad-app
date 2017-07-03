import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import { GenericDynamicListPage } from "../generic-dynamic-list/generic-dynamic-list";
import { SubscriptionsContextPage } from "../subscriptions-context/subscriptions-context";
import { InAppBrowser } from '@ionic-native/in-app-browser';

/*
  Generated class for the Subscriptions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-subscriptions',
  templateUrl: 'subscriptions.html'
})
export class SubscriptionsPage extends GenericDynamicListPage {

  protected full_screen: Boolean = true;
  mode: string = "unsubscribed";
  mode_method: { subscribed: (s, p?) => Promise<any>; unsubscribed: (s, p?) => Promise<any>; };
  applications: { subscribed: any[]; unsubscribed: any[]; }

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events, protected iab: InAppBrowser) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.list_searching = true;
    this.mode_method = {
      subscribed: (s, p?) => this.ws.userApplicationsSubscribed(s, p),
      unsubscribed: (s, p?) => this.ws.userApplicationsAvailable(s, p)
    };
    this.applications = {
      subscribed: null,
      unsubscribed: null
    };    
  }

  protected getUpdatePromise(): Promise<any> {
    return this.mode_method[this.mode](this.search_text);
  }

  protected getLoadMorePromise(): Promise<any> {
    return this.mode_method[this.mode](this.search_text, this.page);
  }

  update() {
    return super.update().then(()=>{
      console.log(this.mode);
      this.applications[this.mode] = this.list;
    });
  }

  segmentChanged(event) {
    if (this.applications[this.mode] == null) {
      this.update();
    }
  }

  selected(application) {
    this.navCtrl.push(SubscriptionsContextPage, { 'application': application });
  }

  addApplication(application) {
    this.ws.userAddApplication(application.name).then((data: any) => {
      this.iab.create(data.url_redirect, '_blank', { hardwareback: 'no', location: 'no' });
    });
  }

}
