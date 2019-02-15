import { FcmProvider } from './../providers/fcm/fcm';
import { tap } from 'rxjs/operators';
import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, LoadingController, Events, AlertController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { Auth } from "../providers/auth";
import { Webservice } from "../providers/webservice/webservice";
import { Storage } from '@ionic/storage';
import { CONFIG } from "../config/config";
import { SubscriptionsPage } from "../pages/subscriptions/subscriptions";
import { TranslateService } from "@ngx-translate/core";
import { ApplicationContents } from "../providers/application-contents";
import { getLang } from "./app.module";
import { LocationTrackerProvider } from "../providers/location-tracker/location-tracker";
import { UserModel } from "./models/user-model";
import { IntroPage } from "../pages/intro/intro";

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
  ];

  available_pages = [];
  displayed_pages = [];

  display_modes = ['not-authenticated', 'authenticated',];

  user_profile_pages = [
    { title: "VIEW_INTRO", root: IntroPage, icon: "help-circle" },
  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menu: MenuController, private auth: Auth,
    private ws: Webservice, public loadingCtrl: LoadingController, storage: Storage, public events: Events,
    public translate: TranslateService, public fcm: FcmProvider, public app_contents: ApplicationContents,
    protected location: LocationTrackerProvider, public alertCtrl: AlertController, protected modalCtrl: ModalController) {

//    this.setRoot(IntroPage);
    this.resetPages();
    platform.ready()
      .then(() => storage.ready())
      .then(() => Promise.all([
        this.ws.available().catch(() => this.errorLoadingService()),
        auth.loadStoredData().catch(() => { }),
        this.initMisc()
      ])
      )
      .then(() => {
        statusBar.styleDefault();
        setTimeout(() => {
          splashScreen.hide();
        }, 200);
        //splashScreen.hide();
      });

    this.initEventSubscriptions();
  }

  public showIntro() {
    let profileModal = this.modalCtrl.create(IntroPage);
    profileModal.present();
  }

  protected initMisc() {
    this.initTranslation();
    this.display('not-authenticated');
    this.auth.isFirstTime().then((first)=>{
      if (first || CONFIG.ALWAYS_SHOW_INTRO) {
        this.showIntro();
      }
    });
    return Promise.resolve();
  }

  protected initTranslation() {
    this.translate.setDefaultLang(CONFIG.DEFAULT_LANG);
    this.translate.use(getLang());
  }

  protected initPush() {
    return this.fcm.getToken();
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

    this.fcm.listenToNotifications().pipe(
      tap(msg => {
        console.log("New notification! " + JSON.stringify(msg));
        this.events.publish('notification:push', msg);
      })
    )
    .subscribe();
  }

  protected errorLoadingService() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'No se ha podido establecer la conexión con el servicio. Intente nuevamente más tarde.',
      buttons: ['OK']
    });
    alert.present();
  }

  public setRoot(page) {
    this.rootPage = page;
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
      this.nav.push(page.root, { data: page.raw_data, from_menu: true });
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
    this.events.publish('notification:push', { 'msg': "prueba" });
  }
}
