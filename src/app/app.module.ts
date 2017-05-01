import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MapaRondinPage } from '../pages/mapa-rondin/mapa-rondin';
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
    MapaRondinPage,
    SubscriptionsPage,
    SubscriptionsContextPage,
  ],
  imports: [
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
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
    MapaRondinPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Webservice,
    Auth,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}