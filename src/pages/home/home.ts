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
  per_page:number;
  page:number;
  has_next_page:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public auth: Auth) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl);
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

  resetPage() {
    this.page = 0;
  }

  nextPage() {
    this.page += 1;
  }

  updateNewsfeed() {
    return this.ws.userNewsfeeds().then((news: any) => {
      this.per_page = news.per_page;
      this.newsfeed = news.data;
      this.has_next_page = (news.next_page_url!= null);
      this.resetPage();
    });
  }

  loadMoreNewsfeed(){
    this.nextPage();
    return this.ws.userNewsfeeds(this.page).then((news: any) => {
      this.per_page = news.per_page;
      this.newsfeed = this.newsfeed.concat(news.data);
      this.has_next_page = (news.next_page_url!= null);
    });
  }

  doInfinite():Promise<any> {
    return this.loadMoreNewsfeed();
  }

}
