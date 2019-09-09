import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { CONFIG } from "../../config/config";
import { Auth } from "../auth";
import { MemoryCache } from "../cache/MemoryCache";
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

/*
  Generated class for the Webservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Webservice {
  private host_url: string;
  private auth: Auth;

  constructor(private http: HttpClient, protected cache: MemoryCache) {
    this.host_url = CONFIG.API_URL;
    //console.log('Hello Webservice Provider');
  }

  private fetch(action: string, header?: HttpHeaders, external_url: boolean = false, force_load: boolean = false) {
    return new Promise((resolve, reject) => {
      let url = "";
      if (!external_url) {
        url = this.host_url + action;
      } else {
        url = action;
      }
      console.log("Por cargar (get): " + url);

      if (this.cache.has(url) && !force_load) {
        resolve(this.cache.get(url));
      } else {
        this.http.get(url, { 'headers': header }).subscribe(
          (data) => {
            console.log('webservice: get(' + url + '). Response: '+ JSON.stringify(data));
            this.cache.set(url, data, CONFIG.MEMORY_CACHE_DEFAULT_TTL * 1000);
            resolve(data);
          },
          err => {
            console.log('webservice: get(' + url + '): Error: ' + JSON.stringify(err));
            if (err.status == 401) {
              this.auth.logout();
            }
            reject(err);
          }
        );
      }
    });
  }

  private put(action: string, data: any, header?: HttpHeaders) {
    return new Promise((resolve, reject) => {
      this.http.put(this.host_url + action, data, { 'headers': header }).subscribe(
        (data) => {
          console.log('webservice: put(' + action + '). Response: ' + JSON.stringify(data));
          resolve(data);
        },
        (err: HttpResponse<any>) => {
          console.log('webservice: put(' + action + '): Error ' + err.status + ' ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }  

  private post(action: string, data: any, header?: HttpHeaders) {
    return new Promise((resolve, reject) => {
      if (data == undefined) {
        data = {};
      }
      this.http.post(this.host_url + action, data, { 'headers': header }).subscribe(
        (data) => {
          console.log('webservice: post(' + action + '). Response: '+ JSON.stringify(data));
          resolve(data);
        },
        (err: HttpResponse<any>) => {
          console.log('webservice: post(' + action + '): Error ' + err.status + ' ' + JSON.stringify(err));
          reject(err);
        }
      );
    });
  }

  private delete(action: string, header?: HttpHeaders) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.host_url + action, { 'headers': header }).map(res => {
        try {
          return res;
        } catch (ex) {
          return null;
        }
      }).subscribe(
        (data) => {
          console.log('webservice: delete (' + action + '). Response: ' + JSON.stringify(data));
          resolve(data);
        },
        (err: HttpResponse<any>) => {
          console.log('webservice: delete (' + action + '): Error ' + err.status + ' ' + JSON.stringify(err));
          reject(err);
        }
        );
    });
  }

  serviceStatus() {
    return this.fetch('v1/config/service_status');
  }

  checkVersionCompatibility(version: string) {
    return this.fetch('v1/config/version/'+version+'/compatibility').then((compatible: boolean) => {
      if (compatible) {
        return Promise.resolve(version);
      }
      return Promise.reject('CLIENT_VERSION_INCOMPATIBLE');
    });
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
    return this.fetch('v1/config/init');
  }

  userRegister(email: string, password: string, username: string, name: string, surname: string) {
    return this.post('v1/user', { 'email': email, 'password': password, 'username': username, 'name': name, 'surname': surname });
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
    return this.post('v1/auth/facebook', data).then((auth_data: any) => {
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

  userNewsfeeds(page: number = 1, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/v1/newsfeed?page=' + page, this.headersFromAuth(auth), false, force_load);
  }

  userData(auth?: Auth) {
    return this.fetch('mobile/v1/user', this.headersFromAuth(auth));
  }

  private headersFromAuth(auth?: Auth): HttpHeaders {
    if (!auth) {
      auth = this.auth;
    }
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + auth.getAccessToken() });
    return headers;
  }

  userApplicationsAvailable(search: string = "", page: number = 1, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/v1/application/available?page=' + page + '&search=' + search, this.headersFromAuth(auth), false, force_load);
  }

  userApplicationsSubscribed(search: string = "", page: number = 1, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/v1/application?page=' + page + '&search=' + search, this.headersFromAuth(auth), false, force_load);
  }

  userNotifications(page: number = 1, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/v1/notification?page=' + page, this.headersFromAuth(auth), false, force_load);
  }

  applicationContextsAvailable(application_name: string, search: string = "", page: number = 1, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/v1/contexts/' + application_name + '?page=' + page + '&search=' + search, this.headersFromAuth(auth), false, force_load);
  }

  userSubscribeContext(application_name: string, context_name: string, auth?: Auth) {
    return this.post('mobile/v1/context/subscription', { 'application_name': application_name, 'context_name': context_name }, this.headersFromAuth(auth));
  }

  userUnsubscribeContext(application_name: string, context_name: string, auth?: Auth) {
    return this.delete('mobile/v1/context/subscription/' + application_name + '/' + context_name, this.headersFromAuth(auth));
  }

  userContextSubscriptions(search: string = "", page: number = 1, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/v1/context/subscriptions?page=' + page + '&search=' + search, this.headersFromAuth(auth), false, force_load);
  }

  userApplicationContextSubscriptions(application_name: string, search: string = "", page: number = 1, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/v1/context/subscriptions/' + application_name + '?page=' + page + '&search=' + search, this.headersFromAuth(auth), false, force_load);
  }

  userRegisterPushToken(token: string, type: string, auth?: Auth) {
    return this.post('mobile/v1/user/push_token', { 'token': token, 'type': type }, this.headersFromAuth(auth));
  }

  userUnregisterPushToken(token: string, type: string, auth?: Auth) {
    return this.delete('mobile/v1/user/push_token/' + type + '/' + token, this.headersFromAuth(auth));
  }

  userApplicationContents(auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/v1/application/content', this.headersFromAuth(auth), false, force_load);
  }

  contentLoadExternal(url: string, force_load: boolean = false) {
    return this.fetch(url, null, true, force_load);
  }

  contentLoad(content_id: number, data: any = null, auth?: Auth) {
    return this.post('mobile/v1/content/data_url/' + content_id, data, this.headersFromAuth(auth));
  }

  userCalendarEvents(auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/v1/calendar_event', this.headersFromAuth(auth), false, force_load);
  }

  userCalendarEventsBetweenDates(start: Date, end: Date, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/v1/calendar_event/between_dates/' + start.toISOString().split('T')[0] + '/' + end.toISOString().split('T')[0], this.headersFromAuth(auth), false, force_load);
  }

  userAttendanceFuture(page: number = 1, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/v1/attendance/future?page=' + page, this.headersFromAuth(auth), false, force_load);
  }

  userAttendanceNow(page: number = 1, auth?: Auth, force_load: boolean = false) {
    return this.fetch('mobile/v1/attendance/now?page=' + page , this.headersFromAuth(auth), false, force_load);
  }

  userAttendanceChangeStatusPresent(attendance_id: number, params: any = null, auth?: Auth) {
    return this.put('mobile/v1/attendance/'+attendance_id+'/status/present', params, this.headersFromAuth(auth));
  }

  userAddApplication(application_name: string, auth?: Auth) {
    return this.post('mobile/v1/application/subscription', { application_name: application_name }, this.headersFromAuth(auth));
  }

  userRemoveApplication(application_name: string, auth?: Auth) {
    return this.delete('mobile/v1/application/subscription/' + application_name, this.headersFromAuth(auth));
  }

  registerLocation(data: any = null, auth?: Auth) {
    return this.post('mobile/v1/user/location', data, this.headersFromAuth(auth));
  }

  userNotificationRead(notifiable_type, notifiable_id, auth?: Auth) {
    return this.post('mobile/v1/notification/read', { notifiable_type: notifiable_type, notifiable_id: notifiable_id }, this.headersFromAuth(auth));
  }

  sendForgotPasswordCode(email: String) {
    return this.post('v1/user/password', { email: email});
  }

  resetForgotPassword(email: String, code: String, password: String) {
    return this.put('v1/user/password', { email: email, code: code, password: password });
  }

  confirmUser(email: String, code: String) {
    return this.put('v1/user/confirmation', { email: email, code: code });
  }
  

}
