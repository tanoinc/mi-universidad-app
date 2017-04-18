import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform, MenuController } from 'ionic-angular';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker,
 PolylineOptions,
} from '@ionic-native/google-maps';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { RondinService } from "../../app/rondin.service";



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
  logError: any;

  @ViewChild('map') Element: ElementRef;
  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  platform: Platform, 
  private googleMaps: GoogleMaps, 
  public http : Http,
  private rondin: RondinService,
  public menuController: MenuController
  ) 
  {
    
  }



ngOnInit() {
    console.log('ngOnInit MapaRondinPage');
    
}

ngAfterViewInit() {
  console.log('ngAfterViewInit MapaRondinPage');
}

ionViewDidLoad() {
    console.log('ionViewDidLoad MapaRondinPage');
    this.rondin.getDatosMapaJson().subscribe(() => this.loadMap());
  }


private add_markers(map, markers_data: MarkerOptions[]) {
  if ((markers_data != null) && (markers_data.length > 0)) {
    for (var _i = 0; _i < markers_data.length; _i++) {
        map.addMarker(markers_data[_i])
            .then((marker: Marker) => {
            marker.showInfoWindow();
            });
    }
  }
}

private add_polylines(map, polylines_data: PolylineOptions) {
  if (polylines_data != null) {
    map.addPolyline(polylines_data);
  }
}


private eventoMapaMenu(map) {

let leftMenu = this.menuController.get('left');

    if (leftMenu) {
      leftMenu.ionOpen.subscribe(() => {
        if (map) {
          map.setClickable(false);
        }
      });

      leftMenu.ionClose.subscribe(() => {
        if (map) {
          map.setClickable(true);
        }
      });
    }

}

  loadMap() {
    let data = this.rondin.datosMapa;
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
    else {
      //La Plata
      let position: LatLng = new LatLng(-34.910368,-57.938890);
      center_pos = {
        target: position,
        zoom: 15,
        tilt: 0
      };
      
    }


 // make sure to create following structure in your view.html file
 // and add a height (for example 100%) to it, else the map won't be visible
 // <ion-content>
 //  <div #map id="map" style="height:100%;"></div>
 // </ion-content>

 // create a new map by passing HTMLElement
 //let element: HTMLElement = document.getElementById('map');
 let map: GoogleMap = this.googleMaps.create(this.Element.nativeElement);

 this.eventoMapaMenu(map);
 
 // listen to MAP_READY event
 // You must wait for this event to fire before adding something to the map or modifying it in anyway
 map.one(GoogleMapsEvent.MAP_READY).then(() => {
 console.log('Map is ready!');


 // move the map's camera to position
 console.log("Center Pos" + JSON.stringify(center_pos));
 map.moveCamera(center_pos);



this.add_polylines(map,polylines_data);
this.add_markers(map,markers_data);

}); //MAP_READY
  }




}