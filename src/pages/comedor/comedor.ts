import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapaPage } from "../mapa/mapa";

/*
  Generated class for the Comedor page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-comedor',
  templateUrl: 'comedor.html'
})
export class ComedorPage {
  private urlMapa : string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.urlMapa = navParams.data.urlMapa;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComedorPage');
  }

  abrirMapa(event) {
    this.navCtrl.push(MapaPage, {url: this.urlMapa});
  }

}
