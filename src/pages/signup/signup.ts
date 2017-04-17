import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import { GenericPage } from "../generic/generic";
import { LoginPage } from "../login/login";

/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: []
})
export class SignupPage extends GenericPage {

  public loading: any;
  public name: string;
  public surname: string;
  public username: string;
  public email: string;
  public password: string;
  public passwordRepeat: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  register(){
    this.showLoader('Registrando');
    this.ws.userRegister(this.email, this.password).then((result) => {
      this.loading.dismiss();
      this.showAlert('Cuenta creada','Su cuenta de usuario ha sido creada con éxito!');
      this.navCtrl.push(LoginPage);
    }, (err) => {
      this.loading.dismiss();
      this.showAlert('Error','No se pudo crear la cuenta.');
    });
  }

}
