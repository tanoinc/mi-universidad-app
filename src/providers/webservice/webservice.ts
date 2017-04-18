import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { CONFIG } from "../../config/config";
import { Auth } from "../auth";

/*
  Generated class for the Webservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Webservice {
  private host_url: string;
  private auth: Auth;

  constructor(private http: Http) {
    this.host_url = CONFIG.API_URL;
    //console.log('Hello Webservice Provider');
  }

  private fetch(action: string, header?: Headers) {
    return new Promise((resolve, reject) => {
      this.http.get(this.host_url + action, { 'headers': header }).map(res => res.json()).subscribe(
        (data) => {
          console.log('webservice: get(' + action + '). Response:'); console.log(data);
          resolve(data);
        },
        err => {
          console.log('webservice: get(' + action + '): Error.');
          reject(err);
        }
      );
    });
  }

  private post(action: string, data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.host_url + action, data).map(res => res.json()).subscribe(
        (data) => {
          console.log('webservice: post(' + action + '). Response:'); console.log(data);
          resolve(data);
        },
        (err:Response) => {
          console.log('webservice: post(' + action + '): Error '+ err.status);
          let return_error = null;
          if (err.status == 422) {
            return_error = err.json();
          } else {
            return_error = err;
          }
          reject(return_error);
        }
      );
    });
  }

  init() {
    return this.fetch('api/v1/config/init');
  }

  userRegister(email: string, password: string, username: string, name: string, surname: string) {
    return this.post('api/v1/user', { 'email': email, 'password': password, 'username': username, 'name': name, 'surname': surname });
  }

  userLogin(username: string, password: string, client_id: string, client_secret: string) {
    let data = {
      'username': username,
      'password': password,
      'grant_type': 'password',
      'client_id': client_id,
      'client_secret': client_secret,
      'scope': '',
    };
    return this.post('oauth/token', data);
  }

  setAuth(auth: Auth) {
    this.auth = auth;
  }

  userNewsfeeds(auth?: Auth) {
    return this.fetch('mobile/api/v1/newsfeed', this.headersFromAuth(auth));
  }

  userData(auth?: Auth) {
    return this.fetch('mobile/api/v1/user', this.headersFromAuth(auth));
  }

  private headersFromAuth(auth?: Auth): Headers {
    if (!auth) {
      auth = this.auth;
    }
    let headers = new Headers({ 'Authorization': 'Bearer ' + auth.getAccessToken() });
    return headers;
  }

}
