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
  private http: Http;
  private host_url: string; 

  constructor(public http_param: Http) {
    this.http = http_param;
    this.host_url = 'http://localhost:8800/';
    console.log('Hello Webservice Provider');
  }

  private get(action: string, success: (data:any) => any, failure?:(data:any) => any) {
    this.http.get(this.host_url+action).map(res => res.json()).subscribe(
      data => {
        console.log('webservice: get('+action+') responese:'); console.log(data);
        success(data);
      },
      err => {
        if (failure != undefined) {
          failure(err);
        }
      });
  }

  init(success: (data:any) => any) {
    this.get('api/v1/config/init', success );
  }

}
