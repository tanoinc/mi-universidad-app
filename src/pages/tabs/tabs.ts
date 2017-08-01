import { Component, ViewChild } from '@angular/core';
import { CONFIG } from "../../config/config";
import { HomePage } from '../home/home';
import { SignupPage } from "../signup/signup";
import { LoginPage } from "../login/login";
import { Auth } from "../../providers/auth";
import { Events, NavController, Tabs, NavParams } from 'ionic-angular';
import { NotificationsPage } from "../notifications/notifications";
import { CalendarPage } from "../calendar/calendar";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('menu_tabs') tabRef: Tabs;

  tabs_hidden: boolean = false;
  current_mode: string;
  available_tabs = [
    { title: "HOME", root: HomePage, icon: "home", display: ['authenticated'] },
    { title: "NOTIFICATIONS", root: NotificationsPage, icon: "notifications", display: ['authenticated'] },
    { title: "LOGIN", root: LoginPage, icon: "log-in", display: ['not-authenticated'] },
    { title: "CREATE_ACCOUNT", root: SignupPage, icon: "person-add", display: ['not-authenticated'] },
    { title: "CALENDAR", root: CalendarPage, icon: "calendar", display: ['authenticated'] },
  ];
  tabs_badge = { "NOTIFICATIONS": 0 }
  displayed_tabs = [];
  display_modes = ['not-authenticated', 'authenticated',];

  constructor(private auth: Auth, public events: Events, public navCtrl: NavController, public params: NavParams) {
    this.display((params.get('mode') ? params.get('mode') : 'not-authenticated'));
    this.events.subscribe('user:authenticated', (auth) => {
      this.navCtrl.setRoot(TabsPage, { mode: 'authenticated' });
    });
    this.events.subscribe('user:unauthenticated', (auth) => {
      this.navCtrl.setRoot(TabsPage, { mode: 'not-authenticated' });
    });

    this.events.subscribe('notification:push', (msg) => {
      this.tabs_badge["NOTIFICATIONS"] += 1;
      if ((!msg.additionalData.foreground) && this.current_mode == 'authenticated') {
        this.tabRef.select(1);
      }
    });
    this.events.subscribe('notification:read', (msg) => {
      this.tabs_badge["NOTIFICATIONS"] = 0;
    });

  }

  ionViewDidLoad() {
    //if (!this.tabs_hidden) {
      this.tabRef.select(0);
    //}
  }
  display(mode: string, defaultTab?: number) {
    if (defaultTab != null) {
      this.tabRef.select(defaultTab);
    }
    this.displayed_tabs = this.available_tabs.filter(val => (val.display.find(val_mode => val_mode == mode)));
    this.current_mode = mode;
    if (mode == 'not-authenticated') {
      this.tabs_hidden = CONFIG.NOT_AUTHENTICATED_TABS_HIDDEN;
    } else {
      this.tabs_hidden = false;
    }
  }

  displayedTabs() {
    return this.displayed_tabs;
  }

}
