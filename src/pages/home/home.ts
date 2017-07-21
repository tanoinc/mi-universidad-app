import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events, ModalController } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import 'rxjs/add/operator/map';
import { GenericDynamicListPage } from "../generic-dynamic-list/generic-dynamic-list";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: []
})
export class HomePage extends GenericDynamicListPage  {

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events, protected modalCtrl: ModalController) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.full_screen = false;
    this.list_searching = true;
  }

  ionViewDidLoad() {
    this.list_searching = true;
    super.ionViewDidLoad();
  }

  protected getUpdatePromise(force_load: boolean = false): Promise<any> {
    return this.ws.userNewsfeeds(0, null, force_load);
  }

  protected getLoadMorePromise(): Promise<any> {
    return this.ws.userNewsfeeds(this.page);
  }
}
