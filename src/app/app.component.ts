import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, LoadingController, Events, AlertController } from 'ionic-angular';
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
import { ApplicationContents } from "../providers/application-contents";
import { PreferencesPage } from "../pages/preferences/preferences";
import { getLang } from "./app.module";
import { LocationTrackerProvider } from "../providers/location-tracker/location-tracker";
import { UserModel } from "./models/user-model";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;
  @ViewChild(Nav) nav: Nav;
  public loading;
  public user: UserModel = null;
  public full_screen: boolean = false;
  public current_display_mode = null;

  readonly static_pages = [
    { title: "SUBSCRIPTIONS", root: SubscriptionsPage, icon: "pricetags", display: ['authenticated'] },
    { title: "CONTACT", root: ContactPage, icon: "contacts", display: ['authenticated', 'not-authenticated'] },
  ];

  available_pages = [];
  displayed_pages = [];

  display_modes = ['not-authenticated', 'authenticated',];

  user_profile_pages = [
    { title: "PREFERENCES", root: PreferencesPage, icon: "options" },
  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menu: MenuController, private auth: Auth,
    private ws: Webservice, public loadingCtrl: LoadingController, storage: Storage, public events: Events,
    public translate: TranslateService, public push: Push, public app_contents: ApplicationContents,
    protected location: LocationTrackerProvider, public alertCtrl: AlertController) {

    this.resetPages();
    platform.ready()
      .then(() => storage.ready())
      .then(() => this.ws.available()).catch(() => this.errorLoadingService())
      .then(() => {
        this.initTranslation();
        this.display('not-authenticated');
        return auth.loadStoredData().catch(() => { });
      })
      .then(() => {
        statusBar.styleDefault();
        setTimeout(() => {
          splashScreen.hide();
        }, 100);
        //splashScreen.hide();
      });

    this.initEventSubscriptions();
  }

  protected initTranslation() {
    this.translate.setDefaultLang(CONFIG.DEFAULT_LANG);
    this.translate.use(getLang());
  }

  protected initPush() {
    return this.push.register()
      .then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        return this.auth.registerPushToken(t);
      });
  }

  protected initEventSubscriptions() {
    this.events.subscribe('application:subscription_changed', () => {
      this.updateContentPages();
    });

    this.events.subscribe('user:authenticated', (auth: Auth) => {
      this.user = auth.getUser();
      this.initPush().catch(() => { });
      this.location.startInterval();
      this.updateContentPages().then(() => {
        this.display('authenticated');
      });
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
      });
  }

  protected errorLoadingService() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'No se ha podido establecer la conexión con el servicio. Intente nuevamente más tarde.',
      buttons: ['OK']
    });
    alert.present();
  }

  protected resetPages() {
    this.available_pages = this.static_pages;
  }

  protected updateContentPages() {
    return this.app_contents.load().then(() => {
      this.resetPages();
      this.addAvailablePages(this.app_contents.getPages());
      this.updateDisplay();
    });
  }

  protected updateDisplay() {
    this.displayed_pages = this.available_pages.filter(val => (val.display.find(val_mode => val_mode == this.current_display_mode)));
  }

  addAvailablePages(pages: any[]) {
    this.available_pages = this.available_pages.concat(pages);
  }

  display(mode: string) {
    this.current_display_mode = mode;
    this.updateDisplay();
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
    if (page.subpages) {
      page.show_subpages = !page.show_subpages;
    } else {
      this.nav.push(page.root, { data: page.raw_data });
    }
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
    this.user.logout().then(() => {
      this.user = null;
      this.hideLoader();
    });
  }
  pruebaNotificacion() {
    console.log(JSON.stringify(this.location.getLastPosition()));
    this.events.publish('notification:push', { 'msg': "prueba" });
  }
}
