import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker,
 PolylineOptions
} from '@ionic-native/google-maps';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { map } from "rxjs/operator/map";
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { RondinService } from "../../app/rondin.service";
import { Subscription } from "rxjs/Subscription";


/*
  Generated class for the MapaRondin page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-mapa-rondin',
  templateUrl: 'mapa-rondin.html'
})



export class MapaRondinPage {
    items1: Subscription;
    items: Promise<LatLng[]>;
    logError: any;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  platform: Platform, 
  private googleMaps: GoogleMaps, 
  public http : Http,
  private rondin: RondinService
  ) 
  {
    /*this.items1 = rondinService.getCoordenadasJsonSubscribe();
    console.log(JSON.stringify(this.items));

    console.log("Termino getCoordenadasJson");
    this.items = rondinService.getCoordenadasJson();
    console.log(JSON.stringify(this.items));*/
  }



ngOnInit() {
    console.log('ngOnInit MapaRondinPage');
    this.rondin.getCoordenadasJson().subscribe(() => this.loadMap());
}

ngAfterViewInit() {
 //this.loadMap();
}

ionViewDidLoad() {
    console.log('ionViewDidLoad MapaRondinPage');
    
  }


private add_markers(map, markers_data: Object[]) {
  if ((markers_data != null) && (markers_data.length > 0)) {
    for (var _i = 0; _i < markers_data.length; _i++) {
        map.addMarker(markers_data[_i])
            .then((marker: Marker) => {
            marker.showInfoWindow();
            });
    }
  }
}

private add_polylines(map, polylines_data) {
  //tomar tambien los datos color, width, etc
  if ((polylines_data != null) && (polylines_data.length > 0)) {
    map.addPolyline({
    'points': polylines_data,
    'color' : '#AA00FF',
    'width': 5,
    'geodesic': true
});
}
}

  loadMap() {
    let data = this.rondin.coordenadas;
    let polylines_data = null;
    let markers_data = null;
    //console.log("loadMap datos" + JSON.stringify(coordenadas));
    console.log("loadMap polylines" + JSON.stringify(data.polylines));
    if (data.hasOwnProperty('polylines')) {
      polylines_data = data.polylines;
    }
    if (data.hasOwnProperty('markers')) {
      markers_data = data.markers;
    }
    
    

 // make sure to create following structure in your view.html file
 // and add a height (for example 100%) to it, else the map won't be visible
 // <ion-content>
 //  <div #map id="map" style="height:100%;"></div>
 // </ion-content>

 // create a new map by passing HTMLElement
 let element: HTMLElement = document.getElementById('map');

 let map: GoogleMap = this.googleMaps.create(element);

 // listen to MAP_READY event
 // You must wait for this event to fire before adding something to the map or modifying it in anyway
 map.one(GoogleMapsEvent.MAP_READY).then(() => {
 console.log('Map is ready!');

 // create LatLng object
 
 let laplata: LatLng = new LatLng(-34.90944628977434,-57.938558869063854);
 
 // create CameraPosition
 let position: CameraPosition = {
   target: laplata,
   zoom: 15,
   tilt: 0
 };

 // move the map's camera to position
 map.moveCamera(position);


let markerOptions: MarkerOptions = {
   position: laplata,
   title: 'Ionic'
 };

//map.addMarker(markerOptions)
/*map.addMarker(markers_data)
            .then((marker: Marker) => {
            marker.showInfoWindow();
            });
 */



this.add_polylines(map,polylines_data);
this.add_markers(map,markers_data);

}); //MAP_READY
  }




}