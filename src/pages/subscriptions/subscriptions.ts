import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events, ToastController, ItemSliding, Item, ItemOptions } from 'ionic-angular';
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
  activeItemSliding: ItemSliding = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events, protected iab: InAppBrowser, protected toastCtrl: ToastController) {
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

  ionViewDidLoad() {
    this.list_searching = true;
    super.update();
  }

  update() {
    return super.update().then(() => {
      this.applications[this.mode] = this.list;
    });
  }

  segmentChanged(event) {
    if (this.applications[this.mode] == null) {
      this.list_searching = true;
      this.update();
    }
  }

  selected(application) {
    this.navCtrl.push(SubscriptionsContextPage, { 'application': application });
  }

  protected applicationAdded(application) {
    this.move(application, 'unsubscribed', 'subscribed');
    this.events.publish('application:subscription_changed');
    this.toast("Servicio añadido correctamente!");
  }

  protected toast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'center'
    });
    toast.present();
  }

  addApplication(application) {
    this.ws.userAddApplication(application.name).then((data: any) => {
      if (application.auth_required) {
        let browser = this.iab.create(data.url_redirect, '_blank', { hardwareback: 'no', location: 'no' });
        this.onApplicationConnected(browser, application.name)
          .then(() => {
            this.applicationAdded(application);
          }).catch(() => {
            this.showAlert('Error', 'Se produjo un error al añadir la aplicación');
          });
      } else {
        this.applicationAdded(application);
      }
    });
  }

  move(application, from, to = null) {
    let index: number = this.applications[from].indexOf(application);
    if (index !== -1) {
      this.applications[from].splice(index, 1);
    }
    if (to != null && this.applications[to] != null) {
      this.applications[to].push(application);
    }
  }

  protected applicationRemoved(application) {
    this.move(application, 'subscribed', 'unsubscribed');
    this.events.publish('application:subscription_changed');
    this.toast('Se ha eliminado el servicio.');
  }

  removeApplication(application) {
    this.ws.userRemoveApplication(application.name).then(() => {
      this.applicationRemoved(application);
    });
  }

  onApplicationConnected(browser, application_name) {
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


  openOption(itemSlide: ItemSliding, item: Item, options: ItemOptions) {
    //@TODO: Cambiar para abrir menu de opciones sobre el elemento al presionar (por ahora solo eliminar). Comportamiento de android
    // snippet from: https://gist.github.com/ihsanberahim/b48f2bf659aafc55f629dac6c32dd52a#file-_ionic3_ionitemsliding_click_event-md
    if (this.activeItemSliding !== null) //use this if only one active sliding item allowed
      this.closeOption();

    this.activeItemSliding = itemSlide;

    let swipeAmount = 100;

    itemSlide.startSliding(swipeAmount);
    itemSlide.moveSliding(swipeAmount);

    itemSlide.setElementClass('active-options-right', true);
    itemSlide.setElementClass('active-swipe-right', true);

    item.setElementStyle('transition', null);
    item.setElementStyle('transform', 'translate3d(-' + swipeAmount + 'px, 0px, 0px)');
  }

  closeOption() {
    // snippet from: https://gist.github.com/ihsanberahim/b48f2bf659aafc55f629dac6c32dd52a#file-_ionic3_ionitemsliding_click_event-md
    if (this.activeItemSliding) {
      this.activeItemSliding.close();
      this.activeItemSliding = null;
    }
  }
}
