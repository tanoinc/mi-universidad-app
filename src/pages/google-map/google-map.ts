import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
/*
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  PolylineOptions,
} from '@ionic-native/google-maps';
*/
import { GenericPage } from "../generic/generic";
import { Webservice } from "../../providers/webservice/webservice";
import { GoogleMap, GoogleMaps, MarkerOptions, PolylineOptions, CameraPosition, LatLng, GoogleMapsEvent } from "@ionic-native/google-maps";
import { ApplicationContents } from "../../providers/application-contents";
import { Http } from "@angular/http";

/*
  Generated class for the GoogleMap page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-google-map',
  templateUrl: 'google-map.html'
})
export class GoogleMapPage extends GenericPage {

  @ViewChild('map') map_element: ElementRef;
  protected map: GoogleMap;
  protected content_params: any;
  protected full_screen: Boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events, protected google_map: GoogleMaps, public params: NavParams, protected http: Http) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.content_params = this.navParams.get('data');
    this.load();
  }

  load() {
    this.showLoader('Cargando ' + this.content_params.name);
    this.ws.contentLoad(this.content_params).then((data) => {
      return this.loadMap(data);
    }).then(() => {
      this.loading.dismiss();
    }).catch(() => {
      this.loading.dismiss();
    });
  }

  ionViewDidLoad() {

  }

  private add_markers(map, markers_data: MarkerOptions[]) {
    if ((markers_data != null) && (markers_data.length > 0)) {
      for (var _i = 0; _i < markers_data.length; _i++) {
        map.addMarker(markers_data[_i]);
      }
    }
  }

  private add_polylines(map, polylines_data: PolylineOptions) {
    if (polylines_data != null) {
      map.addPolyline(polylines_data);
    }
  }

  private eventoMapaMenu(map: GoogleMap) {

  }

  loadMap(data) {
    let polylines_data = null;
    let markers_data = null;
    let center_pos: CameraPosition = null;

    if (data.hasOwnProperty('polylines')) {
      polylines_data = data.polylines;
    }
    if (data.hasOwnProperty('markers')) {
      markers_data = data.markers;
    }
    if (data.hasOwnProperty('center')) {
      center_pos = data.center;
    } else {
      //La Plata
      let position: LatLng = new LatLng(-34.910368, -57.938890);
      center_pos = {
        target: position,
        zoom: 15,
        tilt: 0
      };

    }

    this.map = this.google_map.create(this.map_element.nativeElement);
    this.eventoMapaMenu(this.map);
    this.map.clear();

    return this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.map.moveCamera(center_pos);
        this.add_polylines(this.map, polylines_data);
        this.add_markers(this.map, markers_data);
      });
  }

}
