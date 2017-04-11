import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Webservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Webservice {
  private host_url: string; 

  constructor(private http: Http) {
    this.host_url = 'http://localhost:8800/';
    console.log('Hello Webservice Provider');
  }

  private fetch(action: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.host_url+action).map(res => res.json()).subscribe(
        data => {
          console.log('webservice: get('+action+'). Response:'); console.log(data);
          resolve(data);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  init() {
    return this.fetch('api/v1/config/init');
  }

}
