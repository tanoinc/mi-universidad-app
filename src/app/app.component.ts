import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, LoadingController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { Auth } from "../providers/auth";
import { Webservice } from "../providers/webservice/webservice";
import { Storage } from '@ionic/storage';
import { CONFIG } from "../config/config";
import { ContactPage } from "../pages/contact/contact";
import { SubscriptionsPage } from "../pages/subscriptions/subscriptions";



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;
  @ViewChild(Nav) nav: Nav;
  public loading;
  public user = null;
  available_pages = [
    { title: "Suscripciones", root: SubscriptionsPage, icon: "home", display: ['authenticated'] },
    { title: "Contacto", root: ContactPage, icon: "contacts", display: ['authenticated', 'not-authenticated'] },
  ];
  displayed_pages = [];
  display_modes = ['not-authenticated', 'authenticated',];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menu: MenuController, private auth: Auth, private ws: Webservice, public loadingCtrl: LoadingController, storage: Storage, public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.      
      return storage.ready();
    }).then(() => {
      this.display('not-authenticated');
      return auth.loadStoredData().catch(()=>{});
    }).then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.initEventSubscriptions();

  }

  private initEventSubscriptions() {
    this.events.subscribe('user:authenticated', (auth: Auth) => {
      this.user = auth.getUser();
      this.display('authenticated');
    });
  }


  display(mode: string, defaultTab?: number) {
    console.log('MenuController Display mode: ' + mode);
    this.displayed_pages = this.available_pages.filter(val => (val.display.find(val_mode => val_mode == mode)));
  }

  showLoader(text) {
    this.loading = this.loadingCtrl.create({
      content: text + '...'
    });
    this.loading.present();
  }

  getAppTitle() {
    return CONFIG.APP_NAME;
  }

  hideLoader() {
    this.loading.dismiss();
  }

  openMenu() {
    this.menu.open();
  }

  closeMenu() {
    this.menu.close();
  }

  openPage(page) {
    this.nav.push(page);
  }

  openUserProfile() {

  }

}
