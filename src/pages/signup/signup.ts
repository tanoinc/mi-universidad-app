import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";

/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [Webservice]
})
export class SignupPage {

  public loading: any;
  public email: string;
  public password: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private ws: Webservice, public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  register(){
    this.showLoader('Registrando');
    this.ws.userRegister(this.email, this.password).then((result) => {
      this.loading.dismiss();
      console.log(result);
      //this.navCtrl.setRoot(HomePage);
    }, (err) => {
      this.loading.dismiss();
    });
  }
 
  showLoader(text){
    this.loading = this.loadingCtrl.create({
      content: text+'...'
    });
    this.loading.present();
  }

}
