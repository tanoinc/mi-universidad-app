import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events, Content } from 'ionic-angular';
import { GenericPage } from "../generic/generic";
import { Webservice } from "../../providers/webservice/webservice";
import marked from 'marked';

/**
 * Generated class for the TextPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-text',
  templateUrl: 'text.html',
})
export class TextPage extends GenericPage {
  protected content_params: any;
  protected full_screen: Boolean = true;
  @ViewChild(Content) text: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, protected events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.content_params = this.navParams.get('data');
  }

  ionViewDidLoad() {
    this.load()
  }

  load() {
    let text = marked(this.content_params.contained.text);
    this.text = text;
  }

}
