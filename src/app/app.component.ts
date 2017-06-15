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
import { TranslateService } from "@ngx-translate/core";
import { Push, PushToken } from '@ionic/cloud-angular';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;
  @ViewChild(Nav) nav: Nav;
  public loading;
  public user = null;
  public full_screen: boolean = false;

  available_pages = [
    { title: "Suscripciones", root: SubscriptionsPage, icon: "pricetags", display: ['authenticated'] },
    { title: "Contacto", root: ContactPage, icon: "contacts", display: ['authenticated', 'not-authenticated'] },
  ];
  displayed_pages = [];
  display_modes = ['not-authenticated', 'authenticated',];

  user_profile_pages = [
    { title: "PREFERENCES", root: SubscriptionsPage, icon: "options" },
  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menu: MenuController, private auth: Auth, private ws: Webservice, public loadingCtrl: LoadingController, storage: Storage, public events: Events, public translate: TranslateService, public push: Push) {
    platform.ready().then(() => {
      this.translate.setDefaultLang(CONFIG.DEFAULT_LANG);
      return storage.ready();
    }).then(() => {
      this.display('not-authenticated');
      return auth.loadStoredData().catch(() => { });
//    }).then(() => {
//      return this.initPush().catch(() => { });
    }).then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.initEventSubscriptions();

  }

  private initPush() {
    return this.push.register()
    .then((t: PushToken) => {
      return this.push.saveToken(t);
    }).then((t: PushToken) => {
      console.log("Token push: " + t);
      return this.auth.registerPushToken(t);
    });
  }

  private initEventSubscriptions() {
    this.events.subscribe('user:authenticated', (auth: Auth) => {
      this.user = auth.getUser();
      this.initPush().catch(() => { });
      this.display('authenticated');
    });
    this.events.subscribe('user:unauthenticated', (auth: Auth) => {
      this.auth.unregisterPushToken().catch(() => { });
      this.display('not-authenticated');
    });
    this.events.subscribe('app:full_screen_on', () => {
      this.fullScreenOn();
    });
    this.events.subscribe('app:full_screen_off', () => {
      this.fullScreenOff();
    });
    this.push.rx.notification()
      .subscribe((msg) => {
        this.events.publish('notification:push', msg);
        console.log('Notificacion push recibida: ' + JSON.stringify(msg));
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

  fullScreenOn() {
    this.full_screen = true;
  }

  fullScreenOff() {
    this.full_screen = false;
  }

  toggleUserMenu() {
    this.menu.toggle('right');
  }

  logout() {
    this.showLoader('Saliendo');
    this.auth.logout().then(() => {
      this.user = null;
      this.hideLoader();
    });
  }
  pruebaNotificacion() {
    this.events.publish('notification:push', { 'msg': "prueba" });
  }
}
