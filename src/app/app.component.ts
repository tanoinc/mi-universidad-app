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
import { ContactPage } from '../pages/contact/contact';
import { AppVersion } from '@ionic-native/app-version';

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
  public versionNumber: string = null;
  public enabled: boolean = false;

  readonly static_pages = [
    { title: "SUBSCRIPTIONS", root: SubscriptionsPage, icon: "pricetags", display: ['authenticated'] },
  ];

  available_pages = [];
  displayed_pages = [];

  display_modes = ['not-authenticated', 'authenticated',];

  user_profile_pages = [
    { title: "VIEW_INTRO", root: IntroPage, icon: "help-circle" },
    { title: "CONTACT", root: ContactPage, icon: "help-buoy" },
  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menu: MenuController, private auth: Auth,
    private ws: Webservice, public loadingCtrl: LoadingController, storage: Storage, public events: Events,
    public translate: TranslateService, public fcm: FcmProvider, public app_contents: ApplicationContents,
    protected location: LocationTrackerProvider, public alertCtrl: AlertController, protected modalCtrl: ModalController, protected appVersionProvider: AppVersion) {

    this.resetPages();
    platform.ready()
      .then(() => storage.ready())
      .then(() => Promise.all([
        this.ws.available().catch(() => this.errorLoadingService()),
        auth.loadStoredData().catch(() => { }),
        this.checkVersionCompatibility(),
        this.initMisc()
      ])
      )
      .then(() => {
        //statusBar.overlaysWebView(false);
        //statusBar.backgroundColorByHexString('#00FFFF');
        //statusBar.styleDefault();
        statusBar.styleLightContent();
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
    this.initEventSubscriptionsAfterPlatformReady();
    this.initTranslation();
    this.display('not-authenticated');
    this.auth.isFirstTime().then((first) => {
      if (first || CONFIG.ALWAYS_SHOW_INTRO) {
        this.showIntro();
      }
    });
    return Promise.resolve();
  }

  protected checkVersionCompatibility() {
    return this.appVersionProvider.getVersionNumber().then(
      (versionNumber) => {
        this.versionNumber = versionNumber;
        console.log('version '+this.versionNumber);
        Promise.resolve(this.versionNumber);
      }).then(() => { 
        return this.ws.checkVersionCompatibility(this.versionNumber);
      }).catch((error)=>{
        console.log(error);
        if (error == 'cordova_not_available') {
          return Promise.resolve();
        }
        this.enabled = false;
        this.errorVersionCompatible();
        console.log('incompatible!!');
      });
  }

  protected initTranslation() {
    this.translate.setDefaultLang(CONFIG.DEFAULT_LANG);
    this.translate.use(getLang());
  }

  protected initPush() {
    return this.fcm.getToken();
  }

  protected initEventSubscriptionsAfterPlatformReady() {
    this.fcm.listenToNotifications().pipe(
      tap(msg => {
        console.log("New notification! " + JSON.stringify(msg));
        this.events.publish('notification:push', msg);
      })
    )
    .subscribe();
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

  }

  protected errorLoadingService() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'No se ha podido establecer la conexión con el servicio. Intente nuevamente más tarde.',
      buttons: ['OK']
    });
    alert.present();
  }

  protected errorVersionCompatible() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'La versión de la aplicación está desactualizada y puede que no funcione correctamente. Actualícela a una versión más reciente.',
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
    this.menu.close('left');
  }

  toggleLeftMenu() {
    this.menu.close('right');
  }
  
  logout() {
    this.showLoader('Saliendo');
    this.menu.close('right');
    this.user.logout().then(() => {
      setTimeout( () => {
        this.user = null;
        this.hideLoader();
      }, 500 // Tiempo de espera para cerrar el menú. Al desloguearse queda la pantalla inhabilitada debido a que al completarse la animación, no desactiva la inhabilitación de la pantalla. queda con la clase modal-content-open
      );

    });
  }
  pruebaNotificacion() {
    this.events.publish('notification:push', { "object": "{\"updated_at\":\"2019-02-15 18:27:51\",\"created_at\":\"2019-02-15 18:27:51\",\"global\":0,\"id\":128,\"title\":\"Noticia privadaa\",\"send_notification\":1,\"content\":\"Esto es una prueba de una noticia privada a algunos usuarios. Se envió una notificación.\"}", "tap": false, "body": "Esto es una prueba de una noticia privada a algunos usuarios. Se envió una notificación.", "type": "App\\Newsfeed", "title": "Noticia privadaa" });
  }
}
