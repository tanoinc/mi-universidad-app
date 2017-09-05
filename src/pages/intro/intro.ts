import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events, ViewController } from 'ionic-angular';
import { GenericPage } from "../generic/generic";
import { Webservice } from "../../providers/webservice/webservice";
import { TabsPage } from "../tabs/tabs";
import { CONFIG } from "../../config/config";

/**
 * Generated class for the IntroPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  protected slides;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public events: Events) {
    this.slides = CONFIG.INTRO_SLIDES;
  }

  close() {
    this.startUsingApp();
  }

  startUsingApp() {
    this.viewCtrl.dismiss();
  }

  ionViewWillEnter() {
    this.events.publish('app:full_screen_on');
  }

  ionViewWillLeave() {
    this.events.publish('app:full_screen_off');
  }  
}
