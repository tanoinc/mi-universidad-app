import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";

/*
  Generated class for the Generic page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-generic',
  templateUrl: 'generic.html'
})
export class GenericPage {

  public loading: any;
  protected per_page: number;
  protected page: number;
  protected has_next_page: boolean = true;
  protected full_screen: Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events) { }

  ionViewDidLoad() {

  }

  showLoader(text:string="Cargando") {
    this.loading = this.loadingCtrl.create({
      content: text + '...'
    });
    this.loading.present();
  }

  showAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  resetPage() {
    this.page = 0;
  }

  nextPage() {
    this.page += 1;
  }

  setPaginationData(data) {
    this.per_page = data.per_page;
    this.has_next_page = (data.next_page_url != null);
  }

  ionViewWillEnter() {
    if (this.full_screen) {
      this.events.publish('app:full_screen_on');
    } else {
      this.events.publish('app:full_screen_off');
    }
  }

  ionViewWillLeave() {
    this.events.publish('app:full_screen_off');
  }
}
