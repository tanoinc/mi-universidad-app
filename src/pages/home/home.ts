import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  newsfeed: any;

  constructor(public navCtrl: NavController, public http: Http) {
    this.http.get('http://localhost:8800/api/v1/config/init').map(res => res.json()).subscribe(data => {
        //this.newsfeed = data.client_id;
        console.log('inicio log'); console.log(data); console.log('fin');
    });
  }

}
