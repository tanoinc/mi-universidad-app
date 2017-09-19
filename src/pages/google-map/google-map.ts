import { Component, ElementRef, ViewChild, Inject, forwardRef } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { GenericPage } from "../generic/generic";
import { Webservice } from "../../providers/webservice/webservice";
import { GoogleMap, GoogleMaps, MarkerOptions, PolylineOptions, CameraPosition, LatLng, GoogleMapsEvent, Marker, GoogleMapsAnimation } from "@ionic-native/google-maps";
import { ApplicationContents } from "../../providers/application-contents";
import { LocationTrackerProvider } from "../../providers/location-tracker/location-tracker";
import { GoogleMapsMarkerOptions } from "@ionic/cloud-angular/node_modules/ionic-native/dist/es5";

/*
  Generated class for the GoogleMap page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-google-map',
  templateUrl: 'google-map.html',
})
export class GoogleMapPage extends GenericPage {

  @ViewChild('map') map_element: ElementRef;
  protected map: GoogleMap;
  protected content_params: any;
  protected full_screen: Boolean = true;
  protected current_geolocation: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, protected events: Events, protected google_map: GoogleMaps, public params: NavParams,
    @Inject(forwardRef(() => ApplicationContents)) protected content, protected location: LocationTrackerProvider
  ) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.content_params = this.navParams.get('data');
    this.load();
  }

  load() {
    this.showLoader('Cargando ' + this.content_params.name);
    this.location.getCurrentPosition()
      .catch((error) => {
        this.loading.dismiss();
        this.showAlert('Error ' + error.code, 'No se pudo obtener la posición actual en el mapa: ' + error.message);
      })
      .then((geo_data) => {
        //console.log("Geo data: "+JSON.stringify(geo_data));
        if (geo_data) {
          this.current_geolocation = geo_data;
        } else {
          this.current_geolocation = undefined;
        }
        return this.content.contentLoad(this.content_params, this.current_geolocation);
      })
      .then((data) => this.loadMap(data))
      .then(() => {
        this.loading.dismiss();
      })
      .catch(error => {
        console.log(error);
        this.loading.dismiss();
        this.showAlert('Error', 'No se pudieron obtener los datos del mapa.');
      });
  }

  ionViewDidLoad() {

  }

  private addCurrentPosition() {
    console.log("addCurrentPosition > init");
    if (this.current_geolocation != undefined) {
      console.log("addCurrentPosition > existe posicion" + JSON.stringify(this.current_geolocation));
      let marker_options: GoogleMapsMarkerOptions = {
        position: new LatLng(this.current_geolocation.coords.latitude, this.current_geolocation.coords.longitude),
        title: 'Estas aquí',
        icon: {
          url: 'www/assets/img/marker.png',
          size: {
            width: 32,
            height: 32
          }
        },
        animation: GoogleMapsAnimation.BOUNCE
      };
      this.map.addMarker(marker_options);
    }
  }

  private addMarkers(markers_data: MarkerOptions[]) {
    if ((markers_data != null) && (markers_data.length > 0)) {
      for (var _i = 0; _i < markers_data.length; _i++) {
        this.map.addMarker(markers_data[_i]);
      }
    }
  }

  private addPolylines(polylines_data: PolylineOptions) {
    if (polylines_data != null) {
      this.map.addPolyline(polylines_data);
    }
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
    }

    this.map = this.google_map.create(this.map_element.nativeElement);

    return this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        if (!center_pos && this.current_geolocation != undefined) {
          center_pos = {
            target: new LatLng(this.current_geolocation.coords.latitude, this.current_geolocation.coords.longitude),
            zoom: 15,
            tilt: 0
          };
        }
        this.map.clear();
        this.centerMap(center_pos);
        this.addPolylines(polylines_data);
        this.addMarkers(markers_data);
        this.addCurrentPosition();
      });
  }

  centerMap(center_pos) {
    this.map.moveCamera(center_pos);
  }

}
