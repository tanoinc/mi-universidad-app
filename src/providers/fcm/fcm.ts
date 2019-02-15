import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { Auth } from '../auth';
import { Observable } from 'rxjs';

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {
  protected platformName: string;

  constructor(
    public firebaseNative: Firebase,
    private platform: Platform,
    private auth: Auth
  ) {
    console.log('LOG_APP: Antes de platform!');
    if (this.platform.is('android')) {
      this.platformName = 'android';
    } else if (this.platform.is('ios')) {
      this.platformName = 'ios';
    } else {
      this.platformName = null;
    }
    console.log('LOG_APP: Despues de platform!');

  }

  protected isPlatformSupported() {
    return (this.platformName != null);
  }

  async getToken() {
    let token;

    if (!this.isPlatformSupported()) return Promise.reject();

    token = await this.firebaseNative.getToken();
    if (this.platform.is('ios')) {
      await this.firebaseNative.grantPermission();
    }

    this.firebaseNative.onTokenRefresh()
      .subscribe((token: string) => this.saveToken(token, this.platformName) );
    
    return this.saveToken(token, this.platformName);
  }

  protected saveToken(token, platform): Promise<any> {
    if (!token) return;
    return this.auth.registerPushToken(token, platform);
  }

  listenToNotifications() {
    if (!this.isPlatformSupported()) return Observable.fromPromise(Promise.resolve());

    return this.firebaseNative.onNotificationOpen()
  }

}
