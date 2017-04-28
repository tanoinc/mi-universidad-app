import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import { GenericPage } from "../generic/generic";

/*
  Generated class for the Subscriptions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-subscriptions',
  templateUrl: 'subscriptions.html'
})
export class SubscriptionsPage extends GenericPage {

  public applications = [];

  protected search_text: string = "";
  protected list_searching: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl);
    this.list_searching = true;
    this.updateApplications();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscriptionsPage');
  }

  ionViewWillEnter() {
    this.events.publish('app:full_screen_on'); 
  }

  ionViewDidLeave() {
    this.events.publish('app:full_screen_off'); 
  }

  updateApplications() {
    return this.ws.userApplicationsAvailable(this.search_text).then((applications: any) => {
      this.setPaginationData(applications);
      this.applications = applications.data;
      this.resetPage();
      this.list_searching = false;
    });
  }

  doRefresh(refresher) {
    this.updateApplications()
      .then((applications: any) => {
        refresher.complete();
      }).catch((error) => {
        this.showAlert("Error", error);
        refresher.complete();
      });
  }

  loadMoreApplications() {
    this.nextPage();
    return this.ws.userApplicationsAvailable(this.search_text, this.page).then((applications: any) => {
      this.setPaginationData(applications);
      this.applications = this.applications.concat(applications.data);
    });
  }

  doInfinite(): Promise<any> {
    return this.loadMoreApplications();
  }

  search(event) {
    this.list_searching = true;
    this.search_text = event.target.value;
    this.updateApplications()
      .catch((error) => {
        this.showAlert("Error", error);
        this.list_searching = false;
      });
  }
}
