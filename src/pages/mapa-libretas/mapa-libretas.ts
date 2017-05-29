import { Component } from '@angular/core';
import { NavController, NavParams, Platform, MenuController, AlertController } from 'ionic-angular';
import { MapaPage } from "../mapa/mapa";
import { GoogleMaps } from "@ionic-native/google-maps";
import { Http } from "@angular/http";
import { JsonService } from "../../app/json.service";

/*
  Generated class for the MapaLibretas page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-mapa-libretas',
  templateUrl: '../mapa/mapa.html'
})
export class MapaLibretasPage extends MapaPage {

    constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  platform: Platform, 
  protected googleMaps: GoogleMaps, 
  public http : Http,
  protected rondin: JsonService,
  public menuController: MenuController, 
  protected alertCtrl: AlertController
  ) 
  {
    super(navCtrl,navParams,platform,googleMaps,http,rondin,menuController,alertCtrl);
    this.url = navParams.data.url;
  }

  preLoadMap() {

   let datos = this.rondin.getDatos();
   let datosFiltrados = {};
   datosFiltrados['markers'] = [];

   console.log("preLoadMap de MapaLibretasPage");
   for (var _i = 0; _i < datos.length; _i++) {
      //console.log(JSON.stringify(datos[_i]));
      datos[_i].title = datos[_i].name;
      datosFiltrados['markers'].push(datos[_i]);
   }
   console.log(JSON.stringify(datosFiltrados));
   this.rondin.setDatos(datosFiltrados);
   
   this.loadMap();
  }

}
