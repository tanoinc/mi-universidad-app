import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Webservice } from "./webservice/webservice";
import { Auth } from "./auth";
import { Storage } from '@ionic/storage';
import { GoogleMapPage } from "../pages/google-map/google-map";

/*
  Generated class for the ApplicationContents provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ApplicationContents {
  protected readonly CONTENTS_KEY = 'ApplicationContents.contents';
  protected readonly CONTENT_GOOGLE_MAP = "App\\ContentGoogleMap";
  protected contents: any;
  protected loaded: boolean = false;

  constructor(protected auth: Auth, protected ws: Webservice, protected storage: Storage) {

  }

  protected setContents(someContents: any) {
    this.contents = someContents;
    return this.storage.set(this.CONTENTS_KEY, this.contents);
  }

  public getContents() {
    return this.contents;
  }

  protected loadFromWS() {
    if (this.auth.isAuthenticated()) {
      return this.ws.userApplicationContents()
        .then((app_contents) => {
          this.setContents(app_contents);
          this.loaded = true;
        });
    } else {
      this.setContents([]);
      this.loaded = true;
      return Promise.resolve();
    }
  }

  public load(force_load: boolean = false) {
    return this.loadFromWS()
  }

  public isLoaded() {
    return this.loaded;
  }

  protected stringTypeToPage(type: string) {
    if (type == this.CONTENT_GOOGLE_MAP) {
      return GoogleMapPage;
    }
  }

  public getPages() {
    let pages = [];
    this.getContents().forEach(application => {
      let subpages_loaded = [];
      application.contents.forEach(content => {
        subpages_loaded.push({
          title: content.description,
          root: this.stringTypeToPage(content.contained_type),
          icon: content.icon_name,
          raw_data: content
        });
      });
      pages.push({
        title: application.description,
        root: null,
        icon: "apps",
        subpages: subpages_loaded,
        show_subpages: false,
        display: ['authenticated']
      });
    });
    return pages;
  }

  public contentLoad(content_params: any, user_info: any = null) {
    if (content_params.contained.data_url != null) {
      return this.ws.contentLoadExternal(content_params.contained.data_url);
    } else {
      if (content_params.contained.send_user_info)
      {
        return this.ws.contentLoad(content_params.id, user_info);
      } else {
        return this.ws.contentLoad(content_params.id);
      }
    }
  }
}
