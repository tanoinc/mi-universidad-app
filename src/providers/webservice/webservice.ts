import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { CONFIG } from "../../config/config";
import { Auth } from "../auth";
import { MemoryCache } from "../cache/MemoryCache";

/*
  Generated class for the Webservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Webservice {
  private host_url: string;
  private auth: Auth;

  constructor(private http: Http, protected cache: MemoryCache) {
    this.host_url = CONFIG.API_URL;
    //console.log('Hello Webservice Provider');
  }

  private fetch(action: string, header?: Headers, external_url: boolean = false, force_load: boolean = false) {
    return new Promise((resolve, reject) => {
      let local_action = "";
      if (!external_url) {
        local_action = this.host_url + action;
      } else {
        local_action = action;
      }
      console.log("Por cargar (get): " + action);

      if (this.cache.has(local_action) && !force_load) {
        resolve(this.cache.get(local_action));
      } else {
        this.http.get(local_action, { 'headers': header }).map(res => res.json()).subscribe(
          (data) => {
            console.log('webservice: get(' + action + '). Response:'); console.log(data);
            this.cache.set(local_action, data, CONFIG.MEMORY_CACHE_DEFAULT_TTL * 1000);
            resolve(data);
          },
          err => {
            console.log('webservice: get(' + action + '): Error.');
            reject(err);
          }
        );
      }
    });
  }

  private put(action: string, data: any, header?: Headers) {
    return new Promise((resolve, reject) => {
      this.http.put(this.host_url + action, data, { 'headers': header }).map(res => res.json()).subscribe(
        (data) => {
          console.log('webservice: put(' + action + '). Response:'); console.log(data);
          resolve(data);
        },
        (err: Response) => {
          console.log('webservice: put(' + action + '): Error ' + err.status);
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

  private post(action: string, data: any, header?: Headers) {
    return new Promise((resolve, reject) => {
      if (data == undefined) {
        data = {};
      }
      this.http.post(this.host_url + action, data, { 'headers': header }).map(res => res.json()).subscribe(
        (data) => {
          console.log('webservice: post(' + action + '). Response:'); console.log(data);
          resolve(data);
        },
        (err: Response) => {
          console.log('webservice: post(' + action + '): Error ' + err.status);
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

  private delete(action: string, header?: Headers) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.host_url + action, { 'headers': header }).map(res => {
        try {
          return res.json();
        } catch (ex) {
          return null;
        }
      }).subscribe(
        (data) => {
          console.log('webservice: delete (' + action + '). Response:'); console.log(data);
          resolve(data);
        },
        (err: Response) => {
          console.log('webservice: delete (' + action + '): Error ' + err.status);
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

  serviceStatus() {
    return this.fetch('api/v1/config/service_status');
  }

  available() {
    return this.serviceStatus().then((status: { http: boolean, db: boolean, app: boolean }) => {
      if (status.http && status.db && status.app) {
        Promise.resolve();
      } else {
        Promise.reject(status);
      }

    });
  }

  init() {
    return this.fetch('api/v1/config/init');
  }

  userRegister(email: string, password: string, username: string, name: string, surname: string) {
    return this.post('api/v1/user', { 'email': email, 'password': password, 'username': username, 'name': name, 'surname': surname });
  }

  login(username: string, password: string, client_id: string, client_secret: string) {
    let data = {
      'username': username,
      'password': password,
      'grant_type': 'password',
      'client_id': client_id,
      'client_secret': client_secret,
      'scope': '',
    };
    return this.post('oauth/token', data).then((auth_data: any) => {
      auth_data.grant_type = "password";
      return auth_data;
    });
  }

  loginFacebook(client_id: string, fb_info: any) {
    let data = {
      'grant_type': 'facebook',
      'client_id': client_id,
      'payload': fb_info,
    };
    return this.post('api/v1/auth/facebook', data).then((auth_data: any) => {
      auth_data.grant_type = "facebook";
      auth_data.facebook_data = fb_info;
      return auth_data;
    });
  }

  userLogout(auth?: Auth) {
    return this.delete('oauth/tokens/' + this.auth.getAccessTokenId(), this.headersFromAuth(auth))
  }

  setAuth(auth: Auth) {
    this.auth = auth;
  }

  userNewsfeeds(page: number = 0, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/api/v1/newsfeed?page=' + page, this.headersFromAuth(auth), false, force_load);
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

  userApplicationsAvailable(search: string = "", page: number = 0, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/api/v1/application/available?page=' + page + '&search=' + search, this.headersFromAuth(auth), false, force_load);
  }

  userApplicationsSubscribed(search: string = "", page: number = 0, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/api/v1/application?page=' + page + '&search=' + search, this.headersFromAuth(auth), false, force_load);
  }

  userNotifications(page: number = 0, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/api/v1/notification?page=' + page, this.headersFromAuth(auth), false, force_load);
  }

  applicationContextsAvailable(application_name: string, search: string = "", page: number = 0, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/api/v1/contexts/' + application_name + '?page=' + page + '&search=' + search, this.headersFromAuth(auth), false, force_load);
  }

  userSubscribeContext(application_name: string, context_name: string, auth?: Auth) {
    return this.post('mobile/api/v1/context/subscription', { 'application_name': application_name, 'context_name': context_name }, this.headersFromAuth(auth));
  }

  userUnsubscribeContext(application_name: string, context_name: string, auth?: Auth) {
    return this.delete('mobile/api/v1/context/subscription/' + application_name + '/' + context_name, this.headersFromAuth(auth));
  }

  userContextSubscriptions(search: string = "", page: number = 0, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/api/v1/context/subscriptions?page=' + page + '&search=' + search, this.headersFromAuth(auth), false, force_load);
  }

  userApplicationContextSubscriptions(application_name: string, search: string = "", page: number = 0, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/api/v1/context/subscriptions/' + application_name + '?page=' + page + '&search=' + search, this.headersFromAuth(auth), false, force_load);
  }

  userRegisterPushToken(token: string, type: string, auth?: Auth) {
    return this.post('mobile/api/v1/user/push_token', { 'token': token, 'type': type }, this.headersFromAuth(auth));
  }

  userUnregisterPushToken(token: string, type: string, auth?: Auth) {
    return this.delete('mobile/api/v1/user/push_token/' + type + '/' + token, this.headersFromAuth(auth));
  }

  userApplicationContents(auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/api/v1/application/content', this.headersFromAuth(auth), false, force_load);
  }

  contentLoadExternal(url: string, force_load: boolean = false) {
    return this.fetch(url, null, true, force_load);
  }

  contentLoad(content_id: number, data: any = null, auth?: Auth) {
    return this.post('mobile/api/v1/content/data_url/' + content_id, data, this.headersFromAuth(auth));
  }

  userCalendarEvents(auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/api/v1/calendar_event', this.headersFromAuth(auth), false, force_load);
  }

  userCalendarEventsBetweenDates(start: Date, end: Date, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/api/v1/calendar_event/between_dates/' + start.toISOString().split('T')[0] + '/' + end.toISOString().split('T')[0], this.headersFromAuth(auth), false, force_load);
  }

  userAddApplication(application_name: string, auth?: Auth) {
    return this.post('mobile/api/v1/application/subscription', { application_name: application_name }, this.headersFromAuth(auth));
  }

  userRemoveApplication(application_name: string, auth?: Auth) {
    return this.delete('mobile/api/v1/application/subscription/' + application_name, this.headersFromAuth(auth));
  }

  registerLocation(data: any = null, auth?: Auth) {
    return this.post('mobile/api/v1/user/location', data, this.headersFromAuth(auth));
  }

  userNotificationRead(notifiable_type, notifiable_id, auth?: Auth) {
    return this.post('mobile/api/v1/notification/read', { notifiable_type: notifiable_type, notifiable_id: notifiable_id }, this.headersFromAuth(auth));
  }

  sendForgotPasswordCode(email: String) {
    return this.post('api/v1/user/password', { email: email});
  }

  resetForgotPassword(email: String, code: String, password: String) {
    return this.put('api/v1/user/password', { email: email, code: code, password: password });
  }    
}
