import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RemoteConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RemoteConfigProvider {

  protected config: any = {};

  constructor(public http: HttpClient) {
    
  }

  public init(config: any) {
    this.config = config;
  }

  public get(key: string) {
    return this.config[key];
  }

  public getContactEmail() {
    return this.get('contact_email');
  }

  public getContactEmailSubject() {
    return this.get('contact_subject');
  }


}
