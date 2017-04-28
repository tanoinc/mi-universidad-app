import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { ComedorPage } from '../pages/comedor/comedor';
import { MapaPage } from "../pages/mapa/mapa";




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;
  @ViewChild(Nav) nav: Nav;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menu: MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
    });

    
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

    //MapaPage es un mapa que recibe una url donde consultar los componentes del mapa (ej: markers)
    this.nav.push(MapaPage, { url:"assets/data/locations.json"}).catch(() => {
        console.log("Didn't set nav root");
      });
    
  }

  //ComedorPage es una pagina, que contiene un boton a un mapa, éste utiliza MapaPage.
   openPageComedor() {
    this.nav.push(ComedorPage, { urlMapa:"assets/data/comedor.json"}).catch(() => {
        console.log("Didn't set nav root");
      });
  }
}
