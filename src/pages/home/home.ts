import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import 'rxjs/add/operator/map';
import { Auth } from "../../providers/auth";
import { GenericPage } from "../generic/generic";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: []
})
export class HomePage extends GenericPage {

  newsfeed: any;
  private prueba: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public auth: Auth) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl);
    this.newsfeed = [];

    /*
    this.ws.userNewsfeeds(this.auth).then((news: any) => {
      this.newsfeed = news.data;
    });
    */
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  doRefresh(refresher) {
    this.ws.userNewsfeeds(this.auth).then((news: any) => {
      this.newsfeed = news.data;
      refresher.complete();
    }).catch((error) => {
      this.showAlert("Error", error);
      refresher.complete();
    });

  }

}
