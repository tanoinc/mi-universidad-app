import { Component } from '@angular/core';
import { NavController, NavParams, Events, ViewController } from 'ionic-angular';
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
  protected from_menu: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public events: Events) {
    this.slides = CONFIG.INTRO_SLIDES;
    this.from_menu = navParams.get('from_menu');
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
    if (this.from_menu) {
      this.events.publish('app:full_screen_off');
    }
  }  
}
