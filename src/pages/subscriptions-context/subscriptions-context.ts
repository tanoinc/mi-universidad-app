import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import { GenericDynamicListPage } from "../generic-dynamic-list/generic-dynamic-list";

/*
  Generated class for the Subscriptions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-subscriptions-context',
  templateUrl: 'subscriptions-context.html'
})
export class SubscriptionsContextPage extends GenericDynamicListPage {

  protected subscriptions = [];
  protected full_screen: Boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.list_searching = true;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscriptionsContextPage: ');
    console.log(this.getSelectedApplication().name);
  }

  protected getSelectedApplication() {
    return this.navParams.get('application');
  }

  protected getUpdatePromise(): Promise<any> {
    return this.updateSubscriptions().then(() => {
      return this.ws.applicationContextsAvailable(this.getSelectedApplication().name, this.search_text)
    });
  }

  protected getLoadMorePromise(): Promise<any> {
    return this.ws.applicationContextsAvailable(this.getSelectedApplication().name, this.search_text, this.page);
  }

  protected updateSubscriptions() {
    return this.ws.userApplicationContextSubscriptions(this.getSelectedApplication().name)
      .then((data: Array<any>) => {
        this.subscriptions = [];
        data.forEach(element => {
          this.subscriptions.push(element.name);
        });
      });
  }

  hasSuscribed(context_name: string) {
    return this.subscriptions.find(subscription => (subscription == context_name));
  }

  subscribe(context) {
    this.showLoader("Suscribiendo");
    this.ws.userSubscribeContext(this.getSelectedApplication().name, context.name)
      .then(() => {
        this.loading.dismiss();
        this.subscriptions.push(context.name);
      })
      .catch(() => {
        this.showAlert("Error", "Ocurrió un error al suscribirse");
        this.loading.dismiss();
      });
  }

  unsubscribe(context) {
    this.showLoader("Desuscribiendo");
    this.ws.userUnsubscribeContext(this.getSelectedApplication().name, context.name)
      .then(() => {
        this.loading.dismiss();
        let index: number = this.subscriptions.indexOf(context.name);
        if (index !== -1) {
            this.subscriptions.splice(index, 1);
        }          
      })
      .catch(() => {
        this.showAlert("Error", "Ocurrió un error al desuscribirse");
        this.loading.dismiss();
      });
  }
}
