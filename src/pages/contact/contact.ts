import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { GenericPage } from '../generic/generic';
import { Webservice } from '../../providers/webservice/webservice';
import { RemoteConfigProvider } from '../../providers/remote-config/remote-config';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage extends GenericPage {

  full_screen: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events, protected config: RemoteConfigProvider) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);

  }

}
