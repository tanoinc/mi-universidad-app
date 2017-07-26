import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Webservice } from "./webservice/webservice";
import { Storage } from '@ionic/storage';
import { Events } from "ionic-angular";
import { PushToken } from '@ionic/cloud-angular';
import { JwtHelper } from "angular2-jwt";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

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
  private auth_custom_user: any;
  private push_token: PushToken;
  private jwt_helper: JwtHelper;

  constructor(private ws: Webservice, private storage: Storage, public events: Events, protected fb: Facebook) {
    this.setClientId(null);
    this.setClientSecret(null);
    this.loaded = false;
    this.authenticated = false;
    this.jwt_helper = new JwtHelper();
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
    if (auth_data != null) {
      this.auth_data.access_token_data = this.jwt_helper.decodeToken(this.auth_data.access_token);
      this.setAuthenticated(true);
    } else {
      this.setAuthenticated(false);
    }
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

  getAccessTokenId() {
    if (this.isAuthenticated()) {
      return this.auth_data.access_token_data.jti;
    }
  }

  private initPushToken() {
    return this.storage.get('Auth.push_token')
      .then((push_token) => {
        this.push_token = push_token;
      });
  }

  protected clearPushToken() {
    return this.storage.set('Auth.push_token', null).then(() => {
      this.push_token = null;
    });
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
          }).then((result: any) => {
            this.setClientId(result.client_id);
            this.setClientSecret(result.client_secret);
            return this.initPushToken();
          }).then(() => {
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
  /*
    login(username: string, password: string) {
      let user_login = null;
      if (this.ready()) {
        user_login = this.ws.userLogin(username, password, this.client_id, this.client_secret);
      } else {
        user_login = this.init(true).then(() => {
          return this.ws.userLogin(username, password, this.client_id, this.client_secret);
        });
      }
      return this.doAfterLogin(user_login);
    }
    */

  login(username: string, password: string) {
    let user_login = this.whenReady()
      .then(() => this.ws.userLogin(username, password, this.client_id, this.client_secret));
    return this.doBeforeLogin(user_login);
  }

  protected doBeforeLogin(login_promise: Promise<any>) {
    return login_promise
      .then((data) => { this.setAuthData(data) })
      .then(() => { return this.ws.userData(); })
      .then((user) => { this.setUser(user); });
  }

  protected whenReady() {
    if (this.ready()) {
      return Promise.resolve();
    } else {
      return this.init(true);
    }
  }

  facebookLogin() {
    return this.fb.login(['public_profile', 'email', 'user_friends'])
      .then((res: FacebookLoginResponse) => {
        console.log("Logged in FB: " + JSON.stringify(res));

        return this.doBeforeLogin(this.whenReady().then(() => this.ws.facebookLogin(this.client_id, res)));
      })
      .catch(e => console.log('Error logging into Facebook ' + JSON.stringify(e)));
  }

  protected doBeforeLogout(logout_promise: Promise<any>) {
    return logout_promise
      .then(() => this.unregisterPushToken().catch(() => { }))
      .then(() => this.ws.userLogout())
      .then(() => this.clearPushToken())
      .then(() => {
        this.setAuthData(null, true);
        this.events.publish('user:unauthenticated', this);
      });
  }

  logout() {
    return this.doBeforeLogout(Promise.resolve());
  }

  facebookLogout() {
    return this.doBeforeLogout(this.fb.logout());
  }

  setUser(user) {
    this.auth_custom_user = user;
    this.events.publish('user:authenticated', this);
  }

  getUser() {
    return this.auth_custom_user;
  }

  registerPushToken(t: PushToken) {
    this.push_token = t;
    this.storage.set('Auth.push_token', t);
    return this.ws.userRegisterPushToken(t.token, t.type);
  }

  unregisterPushToken() {
    if (this.push_token) {
      return this.ws.userUnregisterPushToken(this.push_token.token, this.push_token.type);
    } else {
      // Para pruebas desde el browser (sin push)
      return Promise.resolve();
    }
  }

}
