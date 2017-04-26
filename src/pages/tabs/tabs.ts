import { Component, ViewChild } from '@angular/core';

import { HomePage } from '../home/home';
import { ContactPage } from '../contact/contact';
import { SignupPage } from "../signup/signup";
import { LoginPage } from "../login/login";
import { Auth } from "../../providers/auth";
import { Events, NavController, Tabs, NavParams } from 'ionic-angular';
import { NotificationsPage } from "../notifications/notifications";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  available_tabs = [
    { title: "Inicio", root: HomePage, icon: "home", display: ['authenticated'] },
    { title: "Notificaciones", root: NotificationsPage, icon: "notifications", display: ['authenticated'] },
    { title: "Ingresar", root: LoginPage, icon: "log-in", display: ['not-authenticated'] },
    { title: "Crear cuenta", root: SignupPage, icon: "person-add", display: ['not-authenticated'] },
    { title: "Contacto", root: ContactPage, icon: "contacts", display: ['authenticated', 'not-authenticated'] },
  ];
  displayed_tabs = [];
  display_modes = ['not-authenticated', 'authenticated',];

  constructor(private auth: Auth, public events: Events, public navCtrl: NavController, public params: NavParams) {
    this.display((params.get('mode') ? params.get('mode') : 'not-authenticated'));
    this.events.subscribe('user:authenticated', (auth) => {
      this.navCtrl.setRoot(TabsPage, { mode: 'authenticated' });
    });
  }

  ionViewDidEnter() {
    this.tabRef.select(0);
  }
  display(mode: string, defaultTab?: number) {
    console.log('Display mode: ' + mode);
    if (defaultTab != null) {
      console.log('Tab setted: ' + defaultTab);
      this.tabRef.select(defaultTab);
    }
    this.displayed_tabs = this.available_tabs.filter(val => (val.display.find(val_mode => val_mode == mode)));
    console.log(this.displayed_tabs);

  }

  displayedTabs() {
    return this.displayed_tabs;
  }

}
