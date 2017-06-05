import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Webservice } from "./webservice/webservice";
import { Storage } from '@ionic/storage';
import { Events } from "ionic-angular";
import { PushToken } from '@ionic/cloud-angular';

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
  private init_promise: Promise<any>;
  private auth_user: any;

  constructor(public http: Http, private ws: Webservice, private storage: Storage, public events: Events) {
    this.setClientId(null);
    this.setClientSecret(null);
    this.loaded = false;
    this.authenticated = false;
  }

  setClientId(id: string) {
    this.client_id = id;
    this.storage.set('Auth.client_id', id);
  }

  setClientSecret(secret: string) {
    this.client_secret = secret;
    this.storage.set('Auth.secret', secret);
  }

  private setAuthData(auth_data: any, store: boolean = true) {
    this.auth_data = auth_data;
    this.setAuthenticated((auth_data != null));
    if (store) {
      this.storage.set('Auth.auth_data', auth_data);
    }
  }

  isAuthenticated() {
    return this.authenticated;
  }

  private setAuthenticated(authenticated: boolean = true) {
    this.authenticated = authenticated;
    if (authenticated) {
      this.ws.setAuth(this);
    } else {
      this.ws.setAuth(null);
    }
  }

  getAuthData() {
    if (this.isAuthenticated()) {
      return this.auth_data;
    }
  }

  getAccessToken() {
    if (this.isAuthenticated()) {
      return this.auth_data.access_token;
    }
  }

  private initAuthData(clear_auth_data: boolean = false) {
    return this.storage.get('Auth.auth_data').then((auth_data) => {
      if (clear_auth_data) {
        auth_data = null
      }
      this.setAuthData(auth_data, clear_auth_data);
      return auth_data;
    });
  }

  clearAuthData() {
    this.setAuthData(null);
  }

  ready() {
    return this.loaded;
  }

  private initReady() {
    this.loaded = true;
  }

  init(clear_auth_data: boolean = false): Promise<any> {
    if (!this.ready()) {
      if (this.init_promise == null) {
        this.init_promise = this
          .initAuthData(clear_auth_data)
          .then(() => {
            return this.ws.init();
          })
          .then((result: any) => {
            this.setClientId(result.client_id);
            this.setClientSecret(result.client_secret);
            this.initReady();
          });
      }
      return this.init_promise;
    } else {
      return Promise.resolve();
    }
  }

  loadStoredData() {
    return this.init()
      .then(() => { return this.ws.userData(); })
      .then((user) => { this.setUser(user); });
  }

  login(username: string, password: string) {
    let user_login = null;
    if (this.ready()) {
      user_login = this.ws.userLogin(username, password, this.client_id, this.client_secret);
    } else {
      user_login = this.init(true).then(() => {
        return this.ws.userLogin(username, password, this.client_id, this.client_secret);
      });
    }
    return user_login
      .then((data) => { this.setAuthData(data) })
      .then(() => { return this.ws.userData(); })
      .then((user) => { this.setUser(user); });
  }

  logout() {
    this.setAuthData(null, true);
    this.events.publish('user:unauthenticated', this);
  }

  setUser(user) {
    this.auth_user = user;
    this.events.publish('user:authenticated', this);
  }

  getUser() {
    return this.auth_user;
  }

  registerPushToken(t: PushToken) {
    return this.ws.userRegisterPushToken(t.token, t.type);
  }

}
