import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { NotifPage } from '../pages/notif/notif';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { Webservice } from "../providers/webservice/webservice";
import { JsonService } from "./json.service";
import { GoogleMaps } from "@ionic-native/google-maps";
import { ComedorPage } from "../pages/comedor/comedor";
import { MapaPage } from "../pages/mapa/mapa";
import { MapaLibretasPage } from "../pages/mapa-libretas/mapa-libretas";

@NgModule({
  declarations: [
    MyApp,
    NotifPage,
    ContactPage,
    HomePage,
    TabsPage,
    MapaPage,
    ComedorPage,
    MapaLibretasPage
  ],
  imports: [
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NotifPage,
    ContactPage,
    HomePage,
    TabsPage,
    MapaPage,
    ComedorPage,
    MapaLibretasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Webservice,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GoogleMaps,
    JsonService
  ]
})
export class AppModule {}
