import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
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
import { CONFIG } from "../config/config";
import { ApplicationContents } from "../providers/application-contents";
import { GoogleMaps } from "@ionic-native/google-maps";
import { GoogleMapPage } from "../pages/google-map/google-map";
import { Geolocation } from '@ionic-native/geolocation';
import { NgCalendarModule } from 'ionic2-calendar';
import { CalendarPage } from "../pages/calendar/calendar";
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { TextPage } from "../pages/text/text";
import { NotificationDetailPage } from "../pages/notification-detail/notification-detail";
import { MemoryCache } from "../providers/cache/MemoryCache";
import { DatePipe } from "@angular/common";
import { PreferencesPage } from "../pages/preferences/preferences";
import { Calendar } from '@ionic-native/calendar';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { Facebook } from '@ionic-native/facebook';
import { GenericPage } from "../pages/generic/generic";
import { GenericDynamicListPage } from "../pages/generic-dynamic-list/generic-dynamic-list";
import { IntroPage } from "../pages/intro/intro";
import { LoginForgotPasswordPage } from "../pages/login-forgot-password/login-forgot-password";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { Firebase } from '@ionic-native/firebase';
import localeEs from '@angular/common/locales/es';
import { FcmProvider } from '../providers/fcm/fcm';
import { NotificationProvider } from '../providers/notification/notification';

/*
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': CONFIG.FIREBASE_APP_ID,
  },
  'push': {
    'sender_id': CONFIG.FIREBASE_SENDER_ID,
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': CONFIG.ANDROID_PUSH_ICON_COLOR
      }
    }
  }
};
*/

registerLocaleData(localeEs);

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
    TextPage,
    NotificationDetailPage,
    PreferencesPage,
    GenericPage,
    GenericDynamicListPage,
    IntroPage,
    LoginForgotPasswordPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
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
    TextPage,
    NotificationDetailPage,
    PreferencesPage,
    GenericPage,
    GenericDynamicListPage,
    IntroPage,
    LoginForgotPasswordPage
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
    MemoryCache,
    DatePipe,
    Calendar,
    Firebase,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LOCALE_ID, useValue: getLang() },
    LocationTrackerProvider,
    Facebook,
    FcmProvider,
    FcmProvider,
    NotificationProvider
  ]
})
export class AppModule { }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function getLang() {
  let lang = navigator.language.split('-')[0];
  return (lang ? lang : CONFIG.DEFAULT_LANG);
}