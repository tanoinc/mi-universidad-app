import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events, ModalController, ToastController } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import 'rxjs/add/operator/map';
import { GenericDynamicListPage } from "../generic-dynamic-list/generic-dynamic-list";
import { NotificationDetailPage } from '../notification-detail/notification-detail';

@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
  providers: []
})
export class AttendancePage extends GenericDynamicListPage {

  protected list_now: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events, protected modalCtrl: ModalController, private toast: ToastController) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.full_screen = false;
    this.list_searching = true;
  }

  ionViewDidLoad() {
    this.list_searching = true;
    this.initUpdates();
    super.ionViewDidLoad();
  }

  private initUpdates() {
    setInterval(() => {
      this.updateNowList();
      this.updateFutureList();
    }, 1000);
  }

  protected isHappeningNow(attendance: any) {
    var start = new Date(attendance.start_time);
    var end = new Date(attendance.end_time);
    var now = new Date();
    return (now >= start && now <= end);
  }

  protected moveToListNow(index) {
    var attendance = this.list[index];
    this.list.splice(index, 1);
    this.list_now.push(attendance);
    this.toastMessage("Ha comenzado una nueva sesión de asistencia!");
  }



  protected toastMessage(message:string) {
    this.toast.create({
      message: message,
      duration: 3000,
      position: 'top',
      showCloseButton: true
    }).present();
  }

  protected removeFromListNow(index) {
    this.list_now.splice(index, 1);
  }

  protected updateNowList() {
    this.list_now.forEach((element, index, list) => {
      if (!this.isHappeningNow(element)) {
        this.removeFromListNow(index);
      }
    });
  }

  protected updateFutureList() {
    this.list.forEach((element, index, list) => {
      if (this.isHappeningNow(element)) {
        this.moveToListNow(index);
      }
    });
  }

  protected getUpdatePromise(force_load: boolean = false): Promise<any> {
    return this.ws.userAttendanceNow(0, null, true)
      .then((data: any) => {
        this.list_now = data.data;
      })
      .then(() => this.ws.userAttendanceFuture(this.page, null, true));
  }

  protected getLoadMorePromise(): Promise<any> {
    return this.ws.userAttendanceFuture(this.page);
  }

  protected controlToIcon(control_name: string) {
    if (control_name == 'qr') {
      return 'qr-scanner';
    }
    if (control_name == 'geolocation') {
      return 'locate';
    }
    if (control_name == 'ip') {
      return 'wifi';
    }

    return 'lock';
  }

  open(attendance_event) {
    let profileModal = this.modalCtrl.create(NotificationDetailPage, { notification: attendance_event, type: 'attendance' });
    profileModal.present();
  }

  present(attendance_event) {
    this.ws.userAttendanceChangeStatusPresent(attendance_event.id)
    .then( ()=>{
      attendance_event.status = 'p';
      this.toastMessage("Presente!");
    }).catch( (error) => {
      console.log(error);
      this.toastMessage(error.error.message);
    });
    
  }
}
