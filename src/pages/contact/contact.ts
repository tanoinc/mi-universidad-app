import { Component } from '@angular/core';

import { NavController, AlertController, LoadingController, NavParams, Events } from 'ionic-angular';
import { GenericPage } from "../generic/generic";
import { Webservice } from "../../providers/webservice/webservice";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage extends GenericPage{

  protected full_screen: Boolean = true;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
  }

}
