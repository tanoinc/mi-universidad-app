import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import { GenericPage } from "../generic/generic";
import { LoginPage } from "../login/login";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { CONFIG } from "../../config/config";

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
  public errorData: any;

  public signupForm: FormGroup;
  protected full_screen = CONFIG.NOT_AUTHENTICATED_FULL_SCREEN;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.errorData = {};
    this.signupForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(1)]),
      'surname': new FormControl('', [Validators.required, Validators.minLength(1)]),
      'username': new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9_-]+$') ]),
      'email': new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$') ]),
      'password': new FormControl('', [Validators.required, Validators.minLength(8)]),
      'passwordRepeat': new FormControl('', [Validators.required, Validators.minLength(8)]),
    }, this.matchingPasswords('password', 'passwordRepeat'));

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  register() {
    this.showLoader('Registrando');
    this.ws.userRegister(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.username, this.signupForm.value.name, this.signupForm.value.surname).then((result) => {
      this.loading.dismiss();
      this.clearForm();
      this.showAlert('Cuenta creada', 'Su cuenta de usuario ha sido creada con éxito!');
      this.navCtrl.push(LoginPage);
    }, (err) => {
      this.loading.dismiss();
      this.errorData = err.data;
      this.showAlert('Error', err.message);
    });
  }

  cancel() {
    this.signupForm.reset();
    this.navCtrl.setRoot(LoginPage);
  }  

  clearForm() {
    this.name = "";
    this.surname = "";
    this.username = "";
    this.email = "";
    this.password = "";
    this.passwordRepeat = "";
  }

  matchingPasswords(field1: string, field2: string): any {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[field1];
      let confirmPassword = group.controls[field2];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
  }

}
