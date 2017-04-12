import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
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
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad GenericPage');
  }

  showLoader(text){
    this.loading = this.loadingCtrl.create({
      content: text+'...'
    });
    this.loading.present();
  }

  showAlert(title:string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }
}
