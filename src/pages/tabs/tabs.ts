import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CONFIG } from "../../config/config";
import { HomePage } from '../home/home';
import { SignupPage } from "../signup/signup";
import { LoginPage } from "../login/login";
import { Events, NavController, Tabs, NavParams } from 'ionic-angular';
import { NotificationsPage } from "../notifications/notifications";
import { CalendarPage } from "../calendar/calendar";
import { NotificationProvider } from '../../providers/notification/notification';

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
  tabs_badge = { "NOTIFICATIONS": null }
  displayed_tabs = [];
  display_modes = ['not-authenticated', 'authenticated',];

  constructor(public events: Events, public navCtrl: NavController, public detectorRef: ChangeDetectorRef, public params: NavParams, 
    protected notifications: NotificationProvider) {
    
    this.display((params.get('mode') ? params.get('mode') : 'not-authenticated'));

    this.events.subscribe('user:authenticated', (auth) => {
      this.navCtrl.setRoot(TabsPage, { mode: 'authenticated' });
    });

    this.events.subscribe('user:unauthenticated', (auth) => {
      this.navCtrl.setRoot(TabsPage, { mode: 'not-authenticated' });
    });

    if (this.current_mode == 'authenticated') {
      this.tabs_badge["NOTIFICATIONS"] = this.notifications;
      this.notifications.addAfterNotificationCall( notification => {
        this.detectorRef.detectChanges();
      });
    }

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
