import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule, Http } from '@angular/http';
import { Webservice } from "../providers/webservice/webservice";
import { Auth } from '../providers/auth';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from "../pages/login/login";
import { IonicStorageModule } from '@ionic/storage';
import { NotificationsPage } from "../pages/notifications/notifications";
import { SubscriptionsPage } from "../pages/subscriptions/subscriptions";
import { SubscriptionsContextPage } from "../pages/subscriptions-context/subscriptions-context";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { CONFIG } from "../config/config";
import { ApplicationContents } from "../providers/application-contents";
import { GoogleMaps } from "@ionic-native/google-maps";
import { GoogleMapPage } from "../pages/google-map/google-map";
import { Geolocation } from '@ionic-native/geolocation';
import { NgCalendarModule  } from 'ionic2-calendar';
import { CalendarPage } from "../pages/calendar/calendar";
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { TextPage } from "../pages/text/text";

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': CONFIG.FIREBASE_APP_ID,
  },
  'auth': {
    'facebook': {
      'scope': ['email', 'public_profile']
    }
  },  
  'push': {
    'sender_id': CONFIG.FIREBASE_SENDER_ID,
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SignupPage,
    LoginPage,
    NotificationsPage,
    SubscriptionsPage,
    SubscriptionsContextPage,
    GoogleMapPage,
    CalendarPage,
    TextPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    CloudModule.forRoot(cloudSettings),
    NgCalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SignupPage,
    LoginPage,
    NotificationsPage,
    SubscriptionsPage,
    SubscriptionsContextPage,
    GoogleMapPage,
    CalendarPage,
    TextPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Webservice,
    Auth,
    GoogleMaps,
    Geolocation,
    ApplicationContents,
    InAppBrowser,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LOCALE_ID, useValue: "es-AR" }
  ]
})
export class AppModule { }

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}