import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Auth } from "../../providers/auth";
import { SignupPage } from "../signup/signup";

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public credentials: { username: string, password:string };

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: Auth) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(credentials) {

  }
  register(){
      this.navCtrl.push(SignupPage);
  }

}
