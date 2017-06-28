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

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events, protected iab: InAppBrowser) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.list_searching = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscriptionsPage');
  }

  protected getUpdatePromise(): Promise<any> {
    return this.ws.userApplicationsAvailable(this.search_text)
  }

  protected getLoadMorePromise(): Promise<any> {
    return this.ws.userApplicationsAvailable(this.search_text, this.page);
  }

  selected(application) {
    this.navCtrl.push(SubscriptionsContextPage, { 'application': application });
  }

  addApplication(application) {
    this.iab.create('http://google.com/');    
  }

}
