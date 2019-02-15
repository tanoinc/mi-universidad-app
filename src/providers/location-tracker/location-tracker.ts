import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Webservice } from "../webservice/webservice";
import { CONFIG } from "../../config/config";

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationTrackerProvider {
  protected readonly TYPE_INTERVAL = "interval";
  protected readonly TYPE_WATCH = "watch";

  protected frequency: number;
  protected type: string;
  protected position_update_handler;
  protected current_geolocation;
  protected started = false;
  public options;

  constructor(protected geolocation: Geolocation, protected ws: Webservice) {
    this.current_geolocation = null;
    this.frequency = CONFIG.GEOLOCATION_UPDATE_INTERVAL * 1000;
    this.options = {
      timeout: 10000,
      //frequency: this.frequency,
      enableHighAccuracy: true
    };
    //this.startInterval();
  }

  public startInterval() {
    if (!this.started) {
      this.type = this.TYPE_INTERVAL;
      this.started = true;
      this.getCurrentPosition();
      this.position_update_handler = setInterval(() => this.getCurrentPosition(), this.frequency);
    }
  }

  protected updatePostition(position) {
    this.current_geolocation = this.convertToPosition(position);
    this.ws.registerLocation(this.current_geolocation);
    //console.log(JSON.stringify(this.current_geolocation));
  }

  public start() {
    if (!this.started) {
      this.type = this.TYPE_WATCH;
      this.started = true;
      this.position_update_handler = this.geolocation.watchPosition(this.options)
        .filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
          this.updatePostition(position);
        });
    }
  }

  public stop() {
    this.started = false;
    if (this.type == this.TYPE_WATCH) {
      this.position_update_handler.unsubscribe();
    } else if (this.type == this.TYPE_INTERVAL) {
      clearInterval(this.position_update_handler);
    }
  }

  public getCurrentPosition() {
    return this.geolocation.getCurrentPosition(this.options)
      .then((geo_data) => {
        this.updatePostition(geo_data);
        //console.log("GEOLOCATION DATA (getCurrentPosition()): " + JSON.stringify(this.current_geolocation));
        return this.current_geolocation;
        //Promise.resolve(this.current_geolocation);
      }).catch((e) => {
        console.log("Error en getCurrentPosition(): "+JSON.stringify(e));
      });
  }

  public getLastPosition() {
    return this.current_geolocation;
  }

  protected convertToPosition(position: any) {
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
    //console.log("GEOLOCATION DATA (convert): " + JSON.stringify(positionObject));
    return positionObject;
  }
}
