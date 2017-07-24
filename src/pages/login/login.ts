import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Auth } from "../../providers/auth";
import { SignupPage } from "../signup/signup";
import { Webservice } from "../../providers/webservice/webservice";
import { GenericPage } from "../generic/generic";
import { Events } from 'ionic-angular';
import { CONFIG } from "../../config/config";

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage extends GenericPage {

  public credentials: { username: string, password: string };
  protected full_screen = CONFIG.NOT_AUTHENTICATED_FULL_SCREEN;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public auth: Auth, public events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.credentials = { username: "", password: "" };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(credentials) {
    this.showLoader('Validando');
    this.auth.login(credentials.username, credentials.password).then(() => {
      this.loading.dismiss();
    }).catch((error) => {
      this.loading.dismiss();
      this.showAlert("Error", "Usuario o clave incorrectos.");
    });
  }

  register() {
    this.navCtrl.setRoot(SignupPage);
  }

  facebookLogin() {
    this.auth.facebookLogin().then(() => {
      this.loading.dismiss();
    }).catch((error) => {
      this.loading.dismiss();
      this.showAlert("Error", "Ocurró un error al intentar ingresar.");
    });
  }

}
