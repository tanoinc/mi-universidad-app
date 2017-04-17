import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { MapaRondinPage } from "../pages/mapa-rondin/mapa-rondin";
import { Auth } from "../providers/auth";
import { Webservice } from "../providers/webservice/webservice";
import { Storage } from '@ionic/storage';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;
  @ViewChild(Nav) nav: Nav;
  public loading;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menu: MenuController, private auth: Auth, private ws: Webservice, public loadingCtrl: LoadingController, storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.      
      return storage.ready();
    }).then(()=>{
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  showLoader(text){
    this.loading = this.loadingCtrl.create({
      content: text+'...'
    });
    this.loading.present();
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

  openPageMapaRondin() {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(MapaRondinPage).catch(() => {
      console.log("Didn't set nav root");
    });

  }
}
