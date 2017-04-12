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
    //console.log('Hello Webservice Provider');
  }

  private fetch(action: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.host_url+action).map(res => res.json()).subscribe(
        (data) => {
          console.log('webservice: get('+action+'). Response:'); console.log(data);
          resolve(data);
        },
        err => {
          console.log('webservice: get('+action+'): Error.');
          reject(err);
        }
      );
    });
  }

  private post(action: string, data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.host_url+action, data).map(res => res.json()).subscribe(
        (data) => {
          console.log('webservice: post('+action+'). Response:'); console.log(data);
          resolve(data);
        },
        err => {
          console.log('webservice: post('+action+'): Error.');
          reject(err);
        }
      );
    });
  }

  init() {
    return this.fetch('api/v1/config/init');
  }

  userRegister(email: string, password: string) {
    return this.post('api/v1/user', {'email': email, 'password': password});
  }

}
