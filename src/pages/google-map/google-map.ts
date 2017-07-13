import { Component, ElementRef, ViewChild, Inject, forwardRef } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { GenericPage } from "../generic/generic";
import { Webservice } from "../../providers/webservice/webservice";
import { GoogleMap, GoogleMaps, MarkerOptions, PolylineOptions, CameraPosition, LatLng, GoogleMapsEvent } from "@ionic-native/google-maps";
import { Geolocation } from '@ionic-native/geolocation';
import { ApplicationContents } from "../../providers/application-contents";

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
    @Inject(forwardRef(() => ApplicationContents)) protected content, protected geolocation: Geolocation
  ) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.content_params = this.navParams.get('data');
    this.load();
  }

  load() {
    this.showLoader('Cargando ' + this.content_params.name);
    let options = { timeout: 10000, enableHighAccuracy: true };
    this.geolocation.getCurrentPosition(options)
      .catch((error) => {
        this.loading.dismiss();
        this.showAlert('Error ' + error.code, 'No se pudo obtener la posición actual en el mapa: ' + error.message);
      })
      .then((geo_data) => {
        console.log('MAP: Geolocation loaded: ' + JSON.stringify(geo_data));
        this.current_geolocation = this.convertToPosition(geo_data);
        return this.content.contentLoad(this.content_params, this.current_geolocation);
      })
      .then((data) => {
        console.log('MAP: Content loaded: ' + JSON.stringify(data));
        return this.loadMap(data);
      })
      .then(() => {
        this.loading.dismiss();
      })
      .catch(() => {
        this.loading.dismiss();
        this.showAlert('Error', 'No se pudieron obtener los datos del mapa.');
      });
  }

  ionViewDidLoad() {

  }

  convertToPosition(position: any) {
    var positionObject: any = {};

    if ('coords' in position) {
      positionObject.coords = {};

      if ('latitude' in position.coords) {
        positionObject.coords.latitude = position.coords.latitude;
      }
      if ('longitude' in position.coords) {
        positionObject.coords.longitude = position.coords.longitude;
      }
      if ('accuracy' in position.coords) {
        positionObject.coords.accuracy = position.coords.accuracy;
      }
      if ('altitude' in position.coords) {
        positionObject.coords.altitude = position.coords.altitude;
      }
      if ('altitudeAccuracy' in position.coords) {
        positionObject.coords.altitudeAccuracy = position.coords.altitudeAccuracy;
      }
      if ('heading' in position.coords) {
        positionObject.coords.heading = position.coords.heading;
      }
      if ('speed' in position.coords) {
        positionObject.coords.speed = position.coords.speed;
      }
    }
    if ('timestamp' in position) {
      positionObject.timestamp = position.timestamp;
    }

    return positionObject;
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
    }

    this.map = this.google_map.create(this.map_element.nativeElement);
    this.eventoMapaMenu(this.map);

    return this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        if (!center_pos) {
          center_pos = {
            target: new LatLng(this.current_geolocation.coords.latitude, this.current_geolocation.coords.longitude),
            zoom: 15,
            tilt: 0
          };
        }
        this.map.clear();        
        this.centerMap(center_pos);
        this.add_polylines(this.map, polylines_data);
        this.add_markers(this.map, markers_data);
      });
  }

  centerMap(center_pos) {
    this.map.moveCamera(center_pos);
  }

}
