import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public auth: Auth, public events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.newsfeed = [];
    this.resetPage();
    this.updateNewsfeed();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  doRefresh(refresher) {
    this.updateNewsfeed()
    .then((news: any) => {
      refresher.complete();
    }).catch((error) => {
      this.showAlert("Error", error);
      refresher.complete();
    });
  }

  updateNewsfeed() {
    return this.ws.userNewsfeeds().then((news: any) => {
      this.setPaginationData(news);
      this.newsfeed = news.data;
      this.resetPage();
    });
  }

  loadMoreNewsfeed(){
    this.nextPage();
    return this.ws.userNewsfeeds(this.page).then((news: any) => {
      this.setPaginationData(news);
      this.newsfeed = this.newsfeed.concat(news.data);
    });
  }

  doInfinite():Promise<any> {
    return this.loadMoreNewsfeed();
  }

}
