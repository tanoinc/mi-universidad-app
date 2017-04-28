import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { NotifPage } from '../notif/notif';
import { ContactPage } from '../contact/contact';
import { NavParams } from "ionic-angular";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = NotifPage;
  tab3Root: any = ContactPage;
  mySelectedIndex: number;
  constructor(navParams : NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
