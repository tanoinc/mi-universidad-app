import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { GenericPage } from "../generic/generic";
import { Webservice } from "../../providers/webservice/webservice";
import { Auth } from "../../providers/auth";
import { CONFIG } from "../../config/config";
import { LoginPage } from '../login/login';

/**
 * Generated class for the SignupConfirmPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-signup-confirm',
  templateUrl: 'signup-confirm.html',
})
export class SignupConfirmPage extends GenericPage {

  protected full_screen = CONFIG.NOT_AUTHENTICATED_FULL_SCREEN;

  protected email: String;
  protected code: String;
  protected hasMail: boolean = false;

  protected step: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public auth: Auth, public events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.email = navParams.get('email');
    if (this.email) {
      this.hasMail = true;
    }
  }

  send(email, code) {
    if (code == undefined) {
      this.showAlert("Error", "No se ingresó el código de confirmación");
      return;
    }
    if (code.length < 6) {
      this.showAlert("Error", "El código de confirmación debe tener al menos 6 caracteres");
      return;
    }

    this.showLoader("Confirmando");
    this.ws.confirmUser(email, code).then(() => {
      this.loading.dismiss();
      this.navCtrl.pop();
      this.navCtrl.setRoot(LoginPage);
      this.showAlert("Éxito", "El usuario se confirmó correctamente. Ya podés ingresar.");
    }).catch((error) => {
      this.loading.dismiss();
      this.showAlert("Error", "El código de confirmación es inválido.");
    });

  }
}
