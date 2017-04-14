import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import 'rxjs/add/operator/map';
import { Auth } from "../../providers/auth";
import { GenericPage } from "../generic/generic";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Webservice, Auth]
})
export class HomePage extends GenericPage{

  newsfeed: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public auth: Auth) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl);
    this.newsfeed = [{client_id: auth.isLoaded()}, {client_id: 2}];
    auth.login('lucianoc4@cespi.unlp.edu.ar', '123456').then(()=>{
      this.newsfeed[0].client_id = auth.isLoaded();
    }).catch((error)=>{
      this.showAlert("Error", error);
    });
  }

}
