import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Webservice]
})
export class HomePage {

  newsfeed: any;

  constructor(public navCtrl: NavController, private ws: Webservice) {
    ws.init().then((result:any) => { 
      console.log("resultado!: "+result.client_id);
    });
  }

}
