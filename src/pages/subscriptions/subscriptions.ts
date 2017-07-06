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
    return super.update().then(() => {
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
      let browser = this.iab.create(data.url_redirect, '_blank', { hardwareback: 'no', location: 'no' });
      this.onApplicationAdded(browser, application.name);
      /*
      browser.on("loadstop").subscribe(function () {
        //browser.executeScript({ code: "localStorage.setItem('close_window', false);" });
        let nameInterval = setInterval(function () {
          browser.executeScript({ code: "localStorage.getItem('close_window');" }).then((close) => {
            if (close == "true") {
              clearInterval(nameInterval);
              browser.close();
            }
          });
        }, 1000);
      });
      browser.executeScript({ code: "localStorage.getItem(\"close_window\");" });
      */
    });
  }

  onApplicationAdded(browser, application_name) {
    return new Promise((resolve, reject) => {
      let interval = null;
      let already_loaded = false;
      browser.on("loadstop").subscribe(function () {
        if (!already_loaded) {
          already_loaded = true;
          browser.executeScript({ code: "localStorage.setItem('" + application_name + "_status','CONNECTING');" })
          interval = setInterval(function () {
            browser.executeScript({ code: "localStorage.getItem('" + application_name + "_status');" })
              .then((status) => {
                let p_status = status[0];
                console.log(JSON.stringify(p_status));
                if (p_status == "CONNECTED") {
                  clearInterval(interval);
                  browser.close();
                  resolve();
                } else if (p_status == "ERROR") {
                  clearInterval(interval);
                  browser.close();
                  reject();
                }
              }).catch(() => {
                clearInterval(interval);
              });
          }, 1000);
        }
      });

    });
  }
}
