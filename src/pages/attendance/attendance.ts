import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events, ModalController } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import 'rxjs/add/operator/map';
import { GenericDynamicListPage } from "../generic-dynamic-list/generic-dynamic-list";
import { NotificationDetailPage } from '../notification-detail/notification-detail';

@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
  providers: []
})
export class AttendancePage extends GenericDynamicListPage  {

  protected list_now: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events, protected modalCtrl: ModalController) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.full_screen = false;
    this.list_searching = true;
  }

  ionViewDidLoad() {
    this.list_searching = true;
    super.ionViewDidLoad();
  }

  protected getUpdatePromise(force_load: boolean = false): Promise<any> {
    return this.ws.userAttendanceNow()
      .then((data:any) => {
        this.list_now = data.data;
      })
      .then(() => this.ws.userAttendanceFuture(this.page));    
    return this.ws.userAttendanceFuture(0, null, force_load);
  }

  protected getLoadMorePromise(): Promise<any> {
    return this.ws.userAttendanceFuture(this.page);
  }
  
  open(attendance_event) {
    console.log(attendance_event);
    let profileModal = this.modalCtrl.create(NotificationDetailPage, { notification: attendance_event, type: 'attendance' });
    profileModal.present();
  }  
}
