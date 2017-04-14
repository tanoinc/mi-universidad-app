import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Webservice } from "./webservice/webservice";

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Auth {
  public client_id: string;
  private client_secret: string;
  private loaded: boolean;
  private auth_data: any;
  private authenticated: boolean;

  constructor(public http: Http, private ws: Webservice) {
    this.setClientId(null);
    this.setClientSecret(null);
    this.loaded = false;
    this.authenticated = false;
    console.log('Hello Auth Provider');

  }

  setClientId(id: string) {
    this.client_id = id;
  }

  setClientSecret(secret: string) {
    this.client_secret = secret;
  }

  isLoaded() {
    return this.loaded;
  }

  isAuthenticated() {
    return this.authenticated;
  }

  init() {
    if (!this.isLoaded()) {
      return new Promise((resolve, reject) => {
        this.ws.init().then((result: any) => {
          this.setClientId(result.client_id);
          this.setClientSecret(result.client_secret);
          this.loaded = true;
          resolve(true);
        }).catch((ex) => {
          reject(ex);
        });
      });
    } else {
      return new Promise((resolve, reject) => { resolve(true) });
    }
  }

  login(username:string, password:string) {
    return new Promise((resolve, reject) => {
      this.init().then(()=>{
        this.ws.userLogin(username, password, this.client_id, this.client_secret).then((data)=>{
          this.auth_data = data;
          this.authenticated = true;
          resolve();
        }).catch((ex) => {
          reject(ex);
        });
      });
    });
  }

}
