import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { GenericPage } from "../generic/generic";
import { Webservice } from "../../providers/webservice/webservice";

/*
  Generated class for the GenericDynamicList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-generic-dynamic-list',
  templateUrl: 'generic-dynamic-list.html'
})
export class GenericDynamicListPage extends GenericPage {
  public list = [];

  protected search_text: string = "";
  protected list_searching: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events ) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.update();
  }

  protected getUpdatePromise(): Promise<any> {
    return Promise.resolve({});
  }

  protected getLoadMorePromise(): Promise<any> {
    return Promise.resolve({});
  }

  update() {
    return this.getUpdatePromise().then((data: any) => {
      this.setPaginationData(data);
      this.list = data.data;
      this.resetPage();
      this.list_searching = false;
    });
  }

  ionViewDidLoad() {
  }

  doRefresh(refresher) {
    this.update()
      .then((data: any) => {
        refresher.complete();
      }).catch((error) => {
        this.showAlert("Error", error);
        refresher.complete();
      });
  }

  loadMore() {
    this.nextPage();
    return this.getLoadMorePromise().then((data: any) => {
      this.setPaginationData(data);
      this.list = this.list.concat(data.data);
    });
  }

  doInfinite(): Promise<any> {
    return this.loadMore();
  }

  search(event) {
    this.list_searching = true;
    this.search_text = event.target.value;
    this.update()
      .catch((error) => {
        this.showAlert("Error", error);
        this.list_searching = false;
      });
  }


}
