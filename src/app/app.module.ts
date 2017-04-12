import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { NotifPage } from '../pages/notif/notif';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MapaRondinPage } from '../pages/mapa-rondin/mapa-rondin';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { Webservice } from "../providers/webservice/webservice";
import { RondinService } from "./rondin.service";
import { GoogleMaps } from "@ionic-native/google-maps";

@NgModule({
  declarations: [
    MyApp,
    NotifPage,
    ContactPage,
    HomePage,
    TabsPage,
    MapaRondinPage
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
    MapaRondinPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Webservice,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GoogleMaps,
    RondinService
  ]
})
export class AppModule {}
