import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { GenericPage } from "../generic/generic";
import { Webservice } from "../../providers/webservice/webservice";
import { Auth } from "../../providers/auth";
import { CONFIG } from "../../config/config";

/**
 * Generated class for the LoginForgotPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-login-forgot-password',
  templateUrl: 'login-forgot-password.html',
})
export class LoginForgotPasswordPage extends GenericPage {

  protected full_screen = CONFIG.NOT_AUTHENTICATED_FULL_SCREEN;

  protected email: String;
  protected code: String;
  protected password: String;
  protected password_repeat: String;

  protected step: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public auth: Auth, public events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginForgotPasswordPage');
  }

  goToStep(step) {
    this.step = step;
  }

  send(email) {
    console.log(email);
    if (email == undefined) {
      this.showAlert("Error", "No se ingresó un correo electrónico");
      return;
    }
    if (email.length < 6) {
      this.showAlert("Error", "Correo electrónico inválido");
      return;
    }    
    this.showLoader("Enviando");
    this.ws.sendForgotPasswordCode(email).then(() => {
      this.goToStep(2)
      this.loading.dismiss();
    }).catch((error) => {
      this.loading.dismiss();
      this.showAlert("Error", "Ha ocurrido un error al enviar el código.");
    });
  }

  reset(email, code, password, password_repeat) {
    if (code == undefined) {
      this.showAlert("Error", "No se ingresó el código de recuperación");
      return;
    }
    if (code.length < 6) {
      this.showAlert("Error", "El código de recuperación debe tener al menos 6 caracteres");
      return;
    }        
    if (password == undefined) {
      this.showAlert("Error", "Las contraseña no puede estar vacía.");
      return;
    }
    if (password.length < 8) {
      this.showAlert("Error", "Las contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password != password_repeat) {
      this.showAlert("Error", "Las contraseñas no coinciden.");
      return;
    }
    this.showLoader("Reestableciendo");
    this.ws.resetForgotPassword(email, code, password).then(() => {
      this.goToStep(1);
      this.loading.dismiss();
      this.navCtrl.pop();
      this.showAlert("Éxito","La contraseña se reestableció correctamente.");
    }).catch((error) => {
      this.loading.dismiss();
      this.showAlert("Error", "Ha ocurrido un error al reestablecer la contraseña.");
    });

  }
}
